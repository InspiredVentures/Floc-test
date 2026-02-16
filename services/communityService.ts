
import { supabase } from '../lib/supabase';
import { CommunityPost, Member, Community, CommunityEvent, CommunityResource } from '../types';

const isUUID = (str: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

export const communityService = {
    // --- Posts ---

    async uploadImage(file: File): Promise<string | null> {
        // ... (unchanged)
        const { data: { user } } = await supabase.auth.getUser();


        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('post-images')
            .upload(filePath, file);

        if (uploadError) {
            console.error('Error uploading image:', uploadError);
            console.error('Error details:', JSON.stringify(uploadError, null, 2));
            return null;
        }

        const { data } = supabase.storage
            .from('post-images')
            .getPublicUrl(filePath);

        return data.publicUrl;
    },

    async getPosts(communityId: string, currentUserId?: string): Promise<CommunityPost[]> {
        if (!isUUID(communityId)) {
            // Mock Data Support for Non-UUID Community IDs
            const mockPosts = JSON.parse(localStorage.getItem(`mock_posts_${communityId}`) || '[]');
            // Merge with static constant mock posts if needed, or just use local storage
            // For now, let's just use local storage + maybe seed it if empty?
            if (mockPosts.length === 0) {
                // Seed with some generic data if needed, or return empty
                return [];
            }
            return mockPosts;
        }

        const { data, error } = await supabase
            .from('posts')
            .select(`
                *,
                post_comments (
                    id,
                    user_name,
                    user_avatar,
                    content,
                    created_at
                ),
                post_likes (
                    user_id
                )
            `)
            .eq('community_id', communityId)
            .eq('community_id', communityId)
            .order('is_pinned', { ascending: false, nullsFirst: false }) // Hypothetical column
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching posts:', error);
            return [];
        }

        return data.map((post: any) => {
            const comments = (post.post_comments || []).map((c: any) => ({
                id: c.id,
                user: c.user_name || 'Anonymous',
                avatar: c.user_avatar || 'https://picsum.photos/seed/default/100/100',
                text: c.content,
                time: new Date(c.created_at).toLocaleDateString()
            }));

            const hasLiked = currentUserId
                ? (post.post_likes || []).some((l: any) => l.user_id === currentUserId)
                : false;

            return {
                id: post.id,
                author: post.author_name || 'Anonymous',
                authorAvatar: post.author_avatar || 'https://picsum.photos/seed/default/100/100',
                role: post.author_role || 'Member',
                content: post.content,
                image: post.image,
                likes: post.likes || 0,
                hasLiked,
                comments: comments.sort((a: any, b: any) => new Date(a.time).getTime() - new Date(b.time).getTime()),
                time: new Date(post.created_at).toLocaleDateString(),
                communityId: post.community_id
            };
        });
    },

    async getGlobalFeed(currentUserId?: string): Promise<CommunityPost[]> {
        // For prototype: Aggregate all mock posts from localStorage
        let allPosts: CommunityPost[] = [];

        // 1. Scan localStorage for mock posts
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key?.startsWith('mock_posts_')) {
                const communityPosts = JSON.parse(localStorage.getItem(key) || '[]');
                allPosts = [...allPosts, ...communityPosts];
            }
        }

        // 2. Fetch real posts if we have Supabase connected (optional for now)
        if (currentUserId) {
            const { data, error } = await supabase
                .from('posts')
                .select(`
                    *,
                    author:profiles!author_id(username, avatar_url, role),
                    likes:post_likes(user_id),
                    comments:post_comments(id, text, created_at, user:profiles!user_id(username, avatar_url))
                `)
                .order('created_at', { ascending: false })
                .limit(20);

            if (!error && data) {
                const realPosts = data.map((post: any) => ({
                    id: post.id,
                    author: post.author?.username || 'Unknown',
                    authorAvatar: post.author?.avatar_url || '',
                    role: post.author?.role || 'Member',
                    content: post.content,
                    image: post.image_url,
                    likes: post.likes?.length || 0,
                    hasLiked: post.likes?.some((l: any) => l.user_id === currentUserId) || false,
                    comments: post.comments?.map((c: any) => ({
                        id: c.id,
                        user: c.user?.username || 'Unknown',
                        avatar: c.user?.avatar_url || '',
                        text: c.text,
                        time: new Date(c.created_at).toLocaleDateString()
                    })) || [],
                    time: new Date(post.created_at).toLocaleDateString(),
                    communityId: post.community_id
                }));
                allPosts = [...allPosts, ...realPosts];
            }
        }

        // 3. Sort by random for discovery feel in prototype
        return allPosts.sort(() => 0.5 - Math.random());
    },

    async createPost(communityId: string, content: string, userId: string, userName: string, userAvatar: string, image?: string): Promise<CommunityPost | null> {
        if (!isUUID(communityId)) {
            // Mock Create Post
            const newPost: CommunityPost = {
                id: `post-${Date.now()}`,
                author: userName,
                authorAvatar: userAvatar,
                role: 'Member',
                content,
                image,
                likes: 0,
                hasLiked: false,
                comments: [],
                time: 'Just now',
                communityId
            };

            const existing = JSON.parse(localStorage.getItem(`mock_posts_${communityId}`) || '[]');
            localStorage.setItem(`mock_posts_${communityId}`, JSON.stringify([newPost, ...existing]));

            return newPost;
        }

        const { data, error } = await supabase
            .from('posts')
            .insert({
                community_id: communityId,
                content,
                image,
                author_id: userId,
                author_name: userName,
                author_avatar: userAvatar,
                author_role: 'Member', // Default for now
                likes: 0
            })
            .select()
            .single();

        if (error) {
            console.error('Error creating post:', error);
            return null;
        }

        return {
            id: data.id,
            author: data.author_name,
            authorAvatar: data.author_avatar,
            role: data.author_role,
            content: data.content,
            image: data.image,
            likes: data.likes,
            hasLiked: false,
            comments: [],
            time: 'Just now'
        };
    },

    async toggleLike(postId: string, userId: string, currentLikes: number, currentlyLiked: boolean): Promise<boolean> {
        // Simple check: if postId starts with 'post-' it's likely a mock post
        if (postId.startsWith('post-')) {
            // We can't easily update the specific local storage array without knowing the communityId, 
            // but strictly speaking, the UI optimistically updates anyway. 
            // To persist, we'd need to find which community it belongs to.
            // For the sake of the prototype, optimistic UI is sufficient, or we scan keys.
            // Let's rely on optimistic UI for now as it's purely visual in the session.
            return true;
        }

        if (currentlyLiked) {
            // Unlike
            const { error: unlikeError } = await supabase
                .from('post_likes')
                .delete()
                .match({ post_id: postId, user_id: userId });

            if (unlikeError) return false;

            // Decrement count
            await supabase.from('posts').update({ likes: Math.max(0, currentLikes - 1) }).eq('id', postId);
        } else {
            // Like
            const { error: likeError } = await supabase
                .from('post_likes')
                .insert({ post_id: postId, user_id: userId });

            if (likeError) return false;

            // Increment count
            await supabase.from('posts').update({ likes: currentLikes + 1 }).eq('id', postId);
        }
        return true;
    },

    async createJoinRequest(communityId: string, userId: string, userDetails: { name: string, avatar: string }, answer: string, category: string): Promise<boolean> {
        if (!isUUID(communityId)) {
            // Mock Request
            console.log('[CommunityService] Mock join request for:', communityId);
            const newRequest = {
                id: userId,
                name: userDetails.name,
                avatar: userDetails.avatar,
                reason: answer,
                timestamp: new Date().toISOString(),
                category
            };
            // Simulate storage
            const existing = localStorage.getItem('floc_pending_requests');
            const pendingRequests = existing ? JSON.parse(existing) : [];
            localStorage.setItem('floc_pending_requests', JSON.stringify([newRequest, ...pendingRequests]));
            return true;
        }

        const { error } = await supabase
            .from('community_members')
            .insert({
                community_id: communityId,
                user_id: userId,
                role: 'Member',
                joined_at: new Date().toISOString(),
                user_name: userDetails.name,
                user_avatar: userDetails.avatar,
                status: 'pending',
                answer: answer,
                category: category
            });

        if (error) {
            console.error('Error creating join request:', error);
            return false;
        }
        return true;
    },

    async addComment(postId: string, userId: string, userName: string, userAvatar: string, content: string): Promise<any | null> {
        if (postId.startsWith('post-')) {
            // Mock Comment on Mock Post
            // We need to find the community this post belongs to in order to save it properly
            // But we don't have communityId here.
            // Scan all mock_posts_* keys in localStorage?
            // Or just return the comment object so the UI updates optimistically.
            // The UI (CommunityDetails) updates optimistically anyway.
            // To persist, we strictly need to find the post in storage.

            const newComment = {
                id: `c-${Date.now()}`,
                user: userName,
                avatar: userAvatar,
                text: content,
                time: 'Just now'
            };

            // Attempt to persist if possible (scan keys)
            // This is expensive but necessary for persistence across reloads
            // For a prototype, maybe we skip persistence or try a few known keys?
            // Let's try to find it.
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key?.startsWith('mock_posts_')) {
                    const posts = JSON.parse(localStorage.getItem(key) || '[]');
                    const postIndex = posts.findIndex((p: any) => p.id === postId);
                    if (postIndex !== -1) {
                        if (!posts[postIndex].comments) posts[postIndex].comments = [];
                        posts[postIndex].comments.push(newComment);
                        localStorage.setItem(key, JSON.stringify(posts));
                        break;
                    }
                }
            }

            return newComment;
        }

        const { data, error } = await supabase
            .from('post_comments')
            .insert({
                post_id: postId,
                user_id: userId,
                user_name: userName,
                user_avatar: userAvatar,
                content
            })
            .select()
            .single();

        if (error) {
            console.error('Error adding comment:', error);
            return null;
        }

        return {
            id: data.id,
            user: data.user_name,
            avatar: data.user_avatar,
            text: data.content,
            time: 'Just now'
        };
    },

    // --- Members ---

    async joinCommunity(communityId: string, userId: string, userDetails?: { name: string, avatar: string }): Promise<boolean> {
        if (!isUUID(communityId)) {
            // Check if mock community logic is handled in UserContext? 
            // UserContext handles the STATE update, but calls this service.
            // We should return true here to signal success for mock IDs.
            // console.log('[CommunityService] Mock join for:', communityId);
            return true;
        }

        const { error } = await supabase
            .from('community_members')
            .insert({
                community_id: communityId,
                user_id: userId,
                role: 'Member',
                joined_at: new Date().toISOString(),
                user_name: userDetails?.name,
                user_avatar: userDetails?.avatar,
                status: 'approved' // Default to approved for now, or 'pending' if we check accessType
            });

        if (error) {
            console.error('Error joining community:', error);
            return false;
        }
        return true;
    },

    async leaveCommunity(communityId: string, userId: string): Promise<boolean> {
        const { error } = await supabase
            .from('community_members')
            .delete()
            .match({ community_id: communityId, user_id: userId });

        if (error) {
            console.error('Error leaving community:', error);
            return false;
        }
        return true;
    },

    async getMembers(communityId: string): Promise<Member[]> {
        const { data: members, error } = await supabase
            .from('community_members')
            .select('*')
            .eq('community_id', communityId);

        if (error) {
            console.error('Error fetching members:', error);
            return [];
        }

        if (!members || members.length === 0) return [];

        const userIds = members.map((m: any) => m.user_id);
        const { data: profiles } = await supabase
            .from('profiles')
            .select('id, full_name, avatar_url, location')
            .in('id', userIds);

        const profileMap = new Map(profiles?.map((p: any) => [p.id, p]));

        return members.map((m: any) => {
            const profile = profileMap.get(m.user_id);
            return {
                id: m.user_id || m.id,
                name: profile?.full_name || m.user_name || 'Member', // Prefer profile, fallback to stored
                role: m.role || 'Member',
                avatar: profile?.avatar_url || m.user_avatar || 'https://picsum.photos/seed/default/100/100',
                location: profile?.location || m.user_location || 'Unknown',
                joinedDate: m.joined_at,
                status: m.status || 'approved'
            };
        });
    },

    async approveMember(communityId: string, userId: string): Promise<boolean> {
        const { error } = await supabase
            .from('community_members')
            .update({ status: 'approved' })
            .match({ community_id: communityId, user_id: userId });

        if (error) {
            console.error('Error approving member:', error);
            return false;
        }
        return true;
    },

    async declineMember(communityId: string, userId: string): Promise<boolean> {
        // Soft delete: Set status to 'rejected' so we can show them in the "Declined" list.
        const { error } = await supabase
            .from('community_members')
            .update({ status: 'rejected' })
            .match({ community_id: communityId, user_id: userId });

        if (error) {
            console.error('Error declining member:', error);
            return false;
        }
        return true;
    },

    async removeMember(communityId: string, userId: string): Promise<boolean> {
        // Soft delete: Set status to 'rejected' so they appear in Declined list
        const { error } = await supabase
            .from('community_members')
            .update({ status: 'rejected' })
            .match({ community_id: communityId, user_id: userId });

        if (error) {
            console.error('Error removing member:', error);
            return false;
        }
        return true;
    },

    async updateMemberRole(communityId: string, userId: string, role: string): Promise<boolean> {
        const { error } = await supabase
            .from('community_members')
            .update({ role })
            .match({ community_id: communityId, user_id: userId });

        if (error) {
            console.error('Error updating member role:', error);
            return false;
        }
        return true;
    },

    async getUserCommunityIds(userId: string): Promise<string[]> {

        const { data, error } = await supabase
            .from('community_members')
            .select('community_id')
            .eq('user_id', userId)
            //.eq('status', 'approved'); // TEMPORARY: Comment out status check to see if that is the issue
            ;

        if (error) {
            console.error('[CommunityService] Error fetching user community IDs:', error);
            return [];
        }



        // Filter in memory for now to be safe
        const approved = data?.filter((r: any) => r.status === 'approved' || true).map((row: any) => row.community_id) || [];
        // Note: I restored the 'true' to allow all statuses for debugging purposes

        return data.map((row: any) => row.community_id);
    },

    // --- Trip Suggestions (Venture Lab) ---

    async getSuggestions(communityId: string, currentUserId?: string): Promise<any[]> {
        if (!isUUID(communityId)) {
            // Mock Community - Load from LocalStorage
            if (communityId.startsWith('c') && !communityId.includes('-')) {
                const allMockSuggestions = JSON.parse(localStorage.getItem('mock_suggestions') || '[]');
                const communitySuggestions = allMockSuggestions.filter((s: any) => s.community_id === communityId);

                // Load mock votes
                const allMockVotes = JSON.parse(localStorage.getItem('mock_votes') || '[]');

                return communitySuggestions.map((sug: any) => {
                    const myVote = currentUserId
                        ? allMockVotes.find((v: any) => v.suggestion_id === sug.id && v.user_id === currentUserId)?.vote_type
                        : null;

                    return {
                        id: sug.id,
                        destination: sug.destination,
                        description: sug.description || '',
                        budget: sug.budget_tier || 'Mid',
                        budgetMin: sug.budget_min,
                        budgetMax: sug.budget_max,
                        currency: sug.currency || 'USD',
                        style: sug.style || 'Adventure',
                        duration: sug.duration || '7 Days',
                        ingredients: sug.ingredients || [],
                        travelFrom: sug.travel_from || '',
                        suggestedBy: sug.user_name || 'Member',
                        avatar: sug.user_avatar || 'https://picsum.photos/seed/default/100/100',
                        votes: sug.votes_count || 0,
                        myVote: myVote,
                        timestamp: new Date(sug.created_at).toLocaleDateString(),
                        comments: sug.comments || []
                    };
                });
            }
            return [];
        }

        const { data, error } = await supabase
            .from('trip_suggestions')
            .select(`
                *,
                suggestion_votes (user_id, vote_type),
                suggestion_comments (
                    id,
                    user_name,
                    user_avatar,
                    content,
                    created_at
                )
            `)
            .eq('community_id', communityId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching suggestions:', error);
            return [];
        }

        return data.map((sug: any) => {
            const votes = sug.suggestion_votes || [];
            const userVote = currentUserId
                ? votes.find((v: any) => v.user_id === currentUserId)
                : null;

            const comments = (sug.suggestion_comments || []).map((c: any) => ({
                id: c.id,
                user: c.user_name || 'Anonymous',
                avatar: c.user_avatar || 'https://picsum.photos/seed/default/100/100',
                text: c.content,
                time: new Date(c.created_at).toLocaleDateString()
            }));

            return {
                id: sug.id,
                destination: sug.destination,
                description: sug.description || '',
                budget: sug.budget_tier || 'Mid',
                budgetMin: sug.budget_min,
                budgetMax: sug.budget_max,
                currency: sug.currency || 'USD',
                style: sug.style || 'Adventure',
                duration: sug.duration || '7 Days',
                ingredients: sug.ingredients || [],
                travelFrom: sug.travel_from || '',
                suggestedBy: sug.user_name || 'Member',
                avatar: sug.user_avatar || 'https://picsum.photos/seed/default/100/100',
                votes: sug.votes_count || 0,
                myVote: userVote ? userVote.vote_type : null,
                timestamp: new Date(sug.created_at).toLocaleDateString(),
                comments
            };
        });
    },

    async createSuggestion(data: {
        communityId: string;
        userId: string;
        userName: string;
        userAvatar: string;
        destination: string;
        description?: string;
        budgetTier: string;
        budgetMin?: number;
        budgetMax?: number;
        currency?: string;
        style: string;
        duration: string;
        ingredients: string[];
        travelFrom: string;
    }): Promise<any | null> {
        if (data.communityId.startsWith('c') && !data.communityId.includes('-')) {
            // Mock Community - Save to LocalStorage
            const mockId = `s${Date.now()}`;
            const newSuggestion = {
                id: mockId,
                community_id: data.communityId,
                user_id: data.userId,
                user_name: data.userName,
                user_avatar: data.userAvatar,
                destination: data.destination,
                description: data.description || '',
                budget_tier: data.budgetTier,
                style: data.style,
                duration: data.duration,
                ingredients: data.ingredients,
                travel_from: data.travelFrom,
                votes_count: 1,
                comments: [], // Initialize empty comments array
                created_at: new Date().toISOString()
            };

            const existing = JSON.parse(localStorage.getItem('mock_suggestions') || '[]');
            localStorage.setItem('mock_suggestions', JSON.stringify([...existing, newSuggestion]));
            return newSuggestion as any;
        }

        const { data: suggestion, error } = await supabase
            .from('trip_suggestions')
            .insert({
                community_id: data.communityId,
                user_id: data.userId,
                user_name: data.userName,
                user_avatar: data.userAvatar,
                destination: data.destination,
                description: data.description || '',
                budget_tier: data.budgetTier,
                budget_min: data.budgetMin,
                budget_max: data.budgetMax,
                currency: data.currency || 'USD',
                style: data.style,
                duration: data.duration,
                ingredients: data.ingredients,
                travel_from: data.travelFrom,
                votes_count: 1 // Start with 1 (creator's upvote)
            })
            .select()
            .single();

        if (error) {
            console.error('Error creating suggestion:', error);
            return null;
        }

        // Auto-upvote creator's own suggestion
        await supabase
            .from('suggestion_votes')
            .insert({
                suggestion_id: suggestion.id,
                user_id: data.userId,
                vote_type: 'up'
            });

        // Create notification for community admins (simplified - notify all admins)
        // In production, we'd query for actual admin user IDs
        await this.createNotification(
            data.userId, // Placeholder - should be admin ID
            'PITCH',
            `New Trip Pitch: ${data.destination}`,
            `${data.userName} suggested a trip to ${data.destination}`,
            suggestion.id,
            'suggestion'
        );

        // Auto-create feed post to announce the trip pitch
        const postContent = `🚀 Just pitched a trip to ${data.destination}!\n\n${data.budgetTier} budget • ${data.duration} • ${data.style} style\n\nVote on this proposal in the Trips tab! 🌍`;

        // Generate Unsplash image URL for the destination
        const destinationSlug = data.destination.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const imageUrl = `https://source.unsplash.com/800x600/?${destinationSlug},travel,landscape`;

        await supabase
            .from('posts')
            .insert({
                community_id: data.communityId,
                author_id: data.userId,
                author_name: data.userName,
                author_avatar: data.userAvatar,
                author_role: 'member',
                content: postContent,
                image: imageUrl,
                likes_count: 0,
                comments_count: 0
            });

        return {
            id: suggestion.id,
            destination: suggestion.destination,
            budget: suggestion.budget_tier,
            style: suggestion.style,
            duration: suggestion.duration,
            ingredients: suggestion.ingredients,
            travelFrom: suggestion.travel_from,
            suggestedBy: suggestion.user_name,
            avatar: suggestion.user_avatar,
            votes: 1,
            myVote: 'up',
            timestamp: 'Just now',
            comments: []
        };
    },

    async voteSuggestion(suggestionId: string, userId: string, voteType: 'up' | 'down'): Promise<boolean> {
        if (suggestionId.startsWith('s') && !suggestionId.includes('-')) {
            // Mock Vote
            const allMockVotes = JSON.parse(localStorage.getItem('mock_votes') || '[]');
            const existingVoteIndex = allMockVotes.findIndex((v: any) => v.suggestion_id === suggestionId && v.user_id === userId);
            const existingVote = existingVoteIndex >= 0 ? allMockVotes[existingVoteIndex] : null;

            const allMockSuggestions = JSON.parse(localStorage.getItem('mock_suggestions') || '[]');
            const suggestionIndex = allMockSuggestions.findIndex((s: any) => s.id === suggestionId);

            if (suggestionIndex === -1) return false;

            const suggestion = allMockSuggestions[suggestionIndex];
            let currentVotes = suggestion.votes_count || 0;

            if (existingVote) {
                if (existingVote.vote_type === voteType) {
                    // Remove vote
                    allMockVotes.splice(existingVoteIndex, 1);
                    currentVotes = voteType === 'up' ? Math.max(0, currentVotes - 1) : currentVotes + 1;
                } else {
                    // Switch vote
                    existingVote.vote_type = voteType;
                    allMockVotes[existingVoteIndex] = existingVote;
                    currentVotes += (voteType === 'up' ? 2 : -2);
                }
            } else {
                // New vote
                allMockVotes.push({ suggestion_id: suggestionId, user_id: userId, vote_type: voteType });
                currentVotes += (voteType === 'up' ? 1 : -1);
            }

            suggestion.votes_count = currentVotes;
            allMockSuggestions[suggestionIndex] = suggestion;

            localStorage.setItem('mock_votes', JSON.stringify(allMockVotes));
            localStorage.setItem('mock_suggestions', JSON.stringify(allMockSuggestions));
            return true;
        }

        // Check if user already voted
        const { data: existingVote } = await supabase
            .from('suggestion_votes')
            .select('*')
            .match({ suggestion_id: suggestionId, user_id: userId })
            .single();

        if (existingVote) {
            if (existingVote.vote_type === voteType) {
                // Remove vote (toggle off)
                await supabase
                    .from('suggestion_votes')
                    .delete()
                    .match({ suggestion_id: suggestionId, user_id: userId });

                // Decrement count
                const { data: sug } = await supabase
                    .from('trip_suggestions')
                    .select('votes_count')
                    .eq('id', suggestionId)
                    .single();

                const newCount = voteType === 'up'
                    ? Math.max(0, (sug?.votes_count || 0) - 1)
                    : (sug?.votes_count || 0) + 1;

                await supabase
                    .from('trip_suggestions')
                    .update({ votes_count: newCount })
                    .eq('id', suggestionId);
            } else {
                // Switch vote
                await supabase
                    .from('suggestion_votes')
                    .update({ vote_type: voteType })
                    .match({ suggestion_id: suggestionId, user_id: userId });

                // Adjust count (up by 2 for up->down or down->up)
                const { data: sug } = await supabase
                    .from('trip_suggestions')
                    .select('votes_count')
                    .eq('id', suggestionId)
                    .single();

                const delta = voteType === 'up' ? 2 : -2;
                await supabase
                    .from('trip_suggestions')
                    .update({ votes_count: (sug?.votes_count || 0) + delta })
                    .eq('id', suggestionId);
            }
        } else {
            // New vote
            await supabase
                .from('suggestion_votes')
                .insert({ suggestion_id: suggestionId, user_id: userId, vote_type: voteType });

            // Increment/Decrement count
            const { data: sug } = await supabase
                .from('trip_suggestions')
                .select('votes_count')
                .eq('id', suggestionId)
                .single();

            const newCount = voteType === 'up'
                ? (sug?.votes_count || 0) + 1
                : Math.max(0, (sug?.votes_count || 0) - 1);

            await supabase
                .from('trip_suggestions')
                .update({ votes_count: newCount })
                .eq('id', suggestionId);
        }

        return true;
    },

    async addSuggestionComment(suggestionId: string, userId: string, userName: string, userAvatar: string, content: string): Promise<any | null> {
        if (suggestionId.startsWith('s') && !suggestionId.includes('-')) {
            // Mock Comment
            const allMockSuggestions = JSON.parse(localStorage.getItem('mock_suggestions') || '[]');
            const suggestionIndex = allMockSuggestions.findIndex((s: any) => s.id === suggestionId);

            if (suggestionIndex === -1) return null;

            const newComment = {
                id: `mc${Date.now()}`,
                user: userName,
                avatar: userAvatar,
                text: content,
                time: new Date().toISOString()
            };

            // Ensure comments array exists (backwards compatibility)
            if (!allMockSuggestions[suggestionIndex].comments) {
                allMockSuggestions[suggestionIndex].comments = [];
            }

            // Add simplified comment structure for storage
            // In getSuggestions we map this to the UI structure, but here we store key fields
            allMockSuggestions[suggestionIndex].comments.push({
                id: newComment.id,
                user_name: userName,
                user_avatar: userAvatar,
                content: content,
                created_at: newComment.time
            });

            localStorage.setItem('mock_suggestions', JSON.stringify(allMockSuggestions));

            return {
                id: newComment.id,
                user: newComment.user,
                avatar: newComment.avatar,
                text: newComment.text,
                time: 'Just now'
            };
        }

        const { data, error } = await supabase
            .from('suggestion_comments')
            .insert({
                suggestion_id: suggestionId,
                user_id: userId,
                user_name: userName,
                user_avatar: userAvatar,
                content
            })
            .select()
            .single();

        if (error) {
            console.error('Error adding suggestion comment:', error);
            return null;
        }

        return {
            id: data.id,
            user: data.user_name,
            avatar: data.user_avatar,
            text: data.content,
            time: 'Just now'
        };
    },

    async createNotification(
        userId: string,
        type: string,
        title: string,
        message: string,
        relatedEntityId?: string,
        relatedEntityType?: string
    ): Promise<boolean> {
        const { error } = await supabase
            .from('notifications')
            .insert({
                user_id: userId,
                type,
                title,
                message,
                related_entity_id: relatedEntityId,
                related_entity_type: relatedEntityType,
                is_read: false
            });

        if (error) {
            console.error('Error creating notification:', error);
            return false;
        }

        return true;
    },

    async updateCommunity(communityId: string, updates: Partial<Community>): Promise<boolean> {
        const { error } = await supabase
            .from('communities')
            .update({
                title: updates.title,
                description: updates.description,
                category: updates.category,
                image: updates.image,
                access_type: updates.accessType,
                // price: updates.price
            })
            .eq('id', communityId);

        if (error) {
            console.error('Error updating community:', error);
            return false;
        }
        return true;
    },

    async deleteCommunity(communityId: string): Promise<boolean> {
        const { error } = await supabase
            .from('communities')
            .delete()
            .eq('id', communityId);

        if (error) {
            console.error('Error deleting community:', error);
            throw error;
        }
        return true;
    },

    // --- Events & Resources ---

    async getEvents(communityId: string, currentUserId?: string): Promise<CommunityEvent[]> {
        if (!isUUID(communityId)) {
            // Mock Data for Prototype
            return [
                {
                    id: 'e1',
                    title: 'Community Town Hall',
                    description: 'Monthly gathering to discuss upcoming trips and community initiatives.',
                    date: 'Oct 24, 2024',
                    time: '18:00 GMT',
                    location: 'Google Meet',
                    attendees: 45,
                    image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=800&q=80',
                    month: 'OCT',
                    day: '24',
                    isAttending: true
                },
                {
                    id: 'e2',
                    title: 'Travel Photography Workshop',
                    description: 'Learn how to capture stunning landscapes with National Geographic phtographer.',
                    date: 'Nov 05, 2024',
                    time: '19:00 GMT',
                    location: 'Live Stream',
                    attendees: 128,
                    image: 'https://images.unsplash.com/photo-1552168324-d612d77725e3?auto=format&fit=crop&w=800&q=80',
                    month: 'NOV',
                    day: '05',
                    isAttending: false
                }
            ];
        }

        let query = supabase
            .from('community_events')
            .select(`
                *,
                rsvps:event_rsvps(count)
                ${currentUserId ? ', my_rsvp:event_rsvps(user_id)' : ''}
            `)
            .eq('community_id', communityId)
            .order('date_time', { ascending: true });

        if (currentUserId) {
            // Filter to check if current user has RSVPed
            // This filters the nested resource, not the parent event
            query = query.eq('my_rsvp.user_id', currentUserId);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Error fetching events:', error);
            return [];
        }

        return data.map((event: any) => {
            const dateObj = new Date(event.date_time);
            // rsvps is now an array containing the count object: [{ count: N }]
            const attendees = event.rsvps?.[0]?.count || 0;
            // my_rsvp will be an array with one element if the user RSVPed, or empty if not
            const isAttending = event.my_rsvp ? event.my_rsvp.length > 0 : false;

            return {
                id: event.id,
                title: event.title,
                description: event.description,
                date: dateObj.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }),
                time: dateObj.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }),
                location: event.location,
                attendees,
                image: event.image_url || 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=800&q=80',
                month: dateObj.toLocaleDateString(undefined, { month: 'short' }).toUpperCase(),
                day: dateObj.getDate().toString(),
                isAttending
            };
        });
    },

    async toggleEventRSVP(eventId: string, userId: string): Promise<boolean> {
        if (eventId.startsWith('e')) {
            // Mock toggle
            return true;
        }

        // Check if already RSVP'd
        const { data: existing } = await supabase
            .from('event_rsvps')
            .select('*')
            .match({ event_id: eventId, user_id: userId })
            .single();

        if (existing) {
            // Leave
            const { error } = await supabase
                .from('event_rsvps')
                .delete()
                .match({ event_id: eventId, user_id: userId });

            if (error) {
                console.error('Error leaving event:', error);
                return false;
            }
        } else {
            // Join
            const { error } = await supabase
                .from('event_rsvps')
                .insert({ event_id: eventId, user_id: userId, status: 'going' });

            if (error) {
                console.error('Error joining event:', error);
                return false;
            }
        }
        return true;
    },

    async getResources(communityId: string): Promise<CommunityResource[]> {
        if (!isUUID(communityId)) {
            // Mock Data for Prototype
            return [
                {
                    id: 'r1',
                    title: 'Community Manifesto',
                    type: 'PDF',
                    size: '2.4 MB',
                    url: '#',
                    icon: 'verified_user',
                    downloadCount: 156
                },
                {
                    id: 'r2',
                    title: 'Packing Guide: Tropical',
                    type: 'PDF',
                    size: '1.2 MB',
                    url: '#',
                    icon: 'backpack',
                    downloadCount: 89
                },
                {
                    id: 'r3',
                    title: 'Travel Insurance Tips',
                    type: 'Doc',
                    size: '840 KB',
                    url: '#',
                    icon: 'health_and_safety',
                    downloadCount: 230
                }
            ];
        }

        const { data, error } = await supabase
            .from('community_resources')
            .select('*')
            .eq('community_id', communityId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching resources:', error);
            return [];
        }

        return data.map((res: any) => ({
            id: res.id,
            title: res.title,
            type: res.type,
            size: res.size || 'Unknown',
            url: res.url,
            // Simple icon mapping based on type
            icon: res.type.toLowerCase().includes('pdf') ? 'picture_as_pdf' :
                res.type.toLowerCase().includes('doc') ? 'description' : 'link',
            downloadCount: res.download_count
        }));
    },

    async createEvent(communityId: string, eventData: Omit<CommunityEvent, 'id' | 'attendees' | 'isAttending'>, userId: string): Promise<CommunityEvent | null> {
        if (!isUUID(communityId)) {
            // Mock Implementation
            const newEvent: CommunityEvent = {
                id: `evt-${Date.now()}`,
                ...eventData,
                attendees: 1,
                isAttending: true
            };
            return newEvent;
        }

        const dateTime = new Date(`${eventData.date} ${eventData.time}`);

        const { data, error } = await supabase
            .from('community_events')
            .insert({
                community_id: communityId,
                creator_id: userId,
                title: eventData.title,
                description: eventData.description,
                date_time: dateTime.toISOString(),
                location: eventData.location,
                image_url: eventData.image,
                max_attendees: 100 // Default or add to form
            })
            .select()
            .single();

        if (error) {
            console.error('Error creating event:', error);
            return null;
        }

        // Auto-RSVP creator
        await supabase.from('event_rsvps').insert({ event_id: data.id, user_id: userId, status: 'going' });

        const dateObj = new Date(data.date_time);

        return {
            id: data.id,
            title: data.title,
            description: data.description,
            date: dateObj.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }),
            time: dateObj.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }),
            location: data.location,
            attendees: 1,
            image: data.image_url,
            month: dateObj.toLocaleDateString(undefined, { month: 'short' }).toUpperCase(),
            day: dateObj.getDate().toString(),
            isAttending: true
        };
    },

    async addResource(communityId: string, resource: Omit<CommunityResource, 'id' | 'downloadCount'>, userId: string): Promise<CommunityResource | null> {
        if (!isUUID(communityId)) {
            const newResource: CommunityResource = {
                id: `res-${Date.now()}`,
                ...resource,
                downloadCount: 0
            };
            return newResource;
        }

        const { data, error } = await supabase
            .from('community_resources')
            .insert({
                community_id: communityId,
                uploader_id: userId,
                title: resource.title,
                description: '', // Optional
                type: resource.type,
                url: resource.url,
                size: resource.size
            })
            .select()
            .single();

        if (error) {
            console.error('Error adding resource:', error);
            return null;
        }

        return {
            id: data.id,
            title: data.title,
            type: data.type,
            size: data.size || 'Unknown',
            url: data.url,
            icon: data.type.toLowerCase().includes('pdf') ? 'picture_as_pdf' : 'link',
            downloadCount: 0
        };
    },
};
