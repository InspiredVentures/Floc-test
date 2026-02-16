import { supabase } from '../lib/supabase';
import { Community, Trip } from '../types';
import { MOCK_TRIPS } from '../constants';

export const supabaseService = {
    /**
     * Fetch all communities
     */
    async getCommunities(): Promise<Community[]> {

        const { data, error } = await supabase
            .from('communities')
            .select(`
                *,
                upcomingTrips:trips(id, title)
            `)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('[SupabaseService] Error fetching communities:', error);
            return [];
        }

        return data.map((c: any) => ({
            id: c.id,
            title: c.title,
            description: c.description,
            category: c.category,
            image: c.image,
            memberCount: c.member_count,
            meta: c.meta,
            accessType: c.access_type,
            isManaged: c.is_managed,
            upcomingTrips: c.upcomingTrips || [],
            members: [], // Members not fetched for list view performance
            unreadCount: 0,
            entryQuestions: c.entry_questions,
            enabledFeatures: c.enabled_features
        }));
    },



    /**
     * Fetch all trips
     */
    async getTrips(): Promise<Trip[]> {
        let trips: Trip[] = [];

        // 1. Try Supabase
        const { data, error } = await supabase
            .from('trips')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error && data) {
            trips = data.map(mapTrip);
        }

        // 2. Mix in / Fallback to LocalStorage (Mock Trips)
        // Check if we should also load mock trips? 
        // For now, if DB is empty or we are in dev mode, we might want them.
        // Let's ALWAYS load mock trips and append them if they don't exist in DB?
        // Or if DB is empty?
        // Let's just append them for now so "Imported" trips show up even if DB works.
        const storedMock = localStorage.getItem('mock_trips');
        if (storedMock) {
            try {
                const parsed = JSON.parse(storedMock);
                // Filter out duplicates if needed? 
                // For simplified logic, just add them.
                const mockTrips = parsed.map((t: any) => ({
                    ...t,
                    // Ensure dates are parsed if they were strings
                    startDate: new Date(t.startDate),
                    endDate: new Date(t.endDate)
                }));
                // Combine: Real + Mock
                trips = [...trips, ...mockTrips];
            } catch (e) {
                console.error('Failed to parse mock_trips', e);
            }
        }

        return trips;
    },

    /**
     * Create a new trip (for Import tool)
     */
    async createTrip(trip: Omit<Trip, 'id'>, userId?: string): Promise<Trip | null> {
        // 1. Try Supabase if real user
        if (userId && userId !== 'dev-user-id') {
            try {
                const { data, error } = await supabase
                    .from('trips')
                    .insert({
                        title: trip.title,
                        destination: trip.destination,
                        dates: trip.dates,
                        price: trip.price,
                        image: trip.image,
                        status: trip.status,
                        members_count: trip.membersCount,
                        community_id: trip.communityId,
                        wetravel_id: trip.wetravelId
                    })
                    .select()
                    .single();

                if (error) {
                    console.error('Error creating trip in DB:', error);
                } else if (data) {
                    return mapTrip(data);
                }
            } catch (e) {
                console.error('Exception creating trip in DB:', e);
            }
        }

        // 2. Mock / Fallback
        const newTrip = {
            ...trip,
            id: `trip-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            isMock: true
        };

        const stored = JSON.parse(localStorage.getItem('mock_trips') || '[]');
        stored.push(newTrip);
        localStorage.setItem('mock_trips', JSON.stringify(stored));

        return newTrip as Trip;
    },

    /**
     * Fetch a single community by ID
     */
    async getCommunity(id: string): Promise<Community | null> {
        const { data, error } = await supabase
            .from('communities')
            .select(`
        *,
        upcomingTrips:trips(*)
      `)
            .eq('id', id)
            .single();

        if (error) {
            console.error(`Error fetching community ${id}:`, error);
            return null;
        }

        return {
            id: data.id,
            title: data.title,
            meta: data.meta,
            description: data.description,
            image: data.image,
            memberCount: data.member_count,
            category: data.category,
            upcomingTrips: data.upcomingTrips ? data.upcomingTrips.map(mapTrip) : [],
            accessType: data.access_type,
            isManaged: data.is_managed,
            unreadCount: 0
        };
    },

    /**
     * Fetch a single trip by ID
     */
    async getTrip(id: string): Promise<Trip | null> {
        // 1. Check Mock Data first (for static pages)
        const mockTrip = MOCK_TRIPS.find(t => t.id === id);
        if (mockTrip) {
            return mockTrip;
        }

        // 2. Validate UUID to prevent Supabase 400 error
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
        if (!isUUID) {
            console.warn(`[SupabaseService] Trip ID '${id}' is not a valid UUID and not found in mocks.`);
            return null;
        }

        // 3. Try Supabase
        const { data, error } = await supabase
            .from('trips')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error(`Error fetching trip ${id}:`, error);
            return null;
        }

        return mapTrip(data);
    },
    /**
     * Create a new community
     */
    async createCommunity(community: {
        title: string;
        description: string;
        category: string;
        image: string;
        owner_id: string;
        access_type?: string;
        entry_questions?: string[];
        enabled_features?: string[];
    }): Promise<Community | null> {
        const { data, error } = await supabase
            .from('communities')
            .insert({
                title: community.title,
                description: community.description,
                category: community.category,
                image: community.image,
                owner_id: community.owner_id,
                access_type: community.access_type || 'request',
                meta: `${community.category} • 1 member`,
                member_count: '1',
                is_managed: true,
                entry_questions: community.entry_questions || [],
                enabled_features: community.enabled_features || []
            })
            .select()
            .single();

        if (error) {
            console.error('Error creating community:', error);
            return null;
        }

        return {
            id: data.id,
            title: data.title,
            description: data.description,
            category: data.category,
            image: data.image,
            memberCount: data.member_count,
            meta: data.meta,
            accessType: data.access_type,
            isManaged: data.is_managed,
            upcomingTrips: [],
            unreadCount: 0
        };
    },

    /**
     * Add a member to a community (auto-join creator)
     */
    async addMemberToCommunity(communityId: string, userId: string, userData: {
        name: string;
        avatar: string;
        role?: string;
    }): Promise<boolean> {
        const { error } = await supabase
            .from('community_members')
            .insert({
                community_id: communityId,
                user_id: userId,
                user_name: userData.name,
                user_avatar: userData.avatar,
                role: userData.role || 'Owner',
                status: 'approved',
                joined_at: new Date().toISOString()
            });

        if (error) {
            console.error('Error adding member to community:', error);
            return false;
        }

        return true;
    },
};

// Helper to map DB trip to frontend Trip type
const mapTrip = (t: any): Trip => ({
    id: t.id,
    title: t.title,
    destination: t.destination,
    dates: t.dates,
    price: t.price,
    image: t.image,
    status: t.status,
    membersCount: t.members_count,
    communityId: t.community_id,
    wetravelId: t.wetravel_id
});

// Helper to map DB member to frontend Member type
const mapMember = (m: any): any => ({
    id: m.user_id || m.id,
    name: m.user_name || 'Member',
    role: m.role || 'Member',
    avatar: m.user_avatar || 'https://picsum.photos/seed/default/100/100',
    location: m.user_location || 'Unknown',
    joinedDate: m.joined_at,
    status: m.status || 'approved',
    email: m.email
});

// Helper to map DB member to frontend PendingMember type
const mapPendingMember = (m: any): any => ({
    id: m.user_id || m.id,
    name: m.user_name || 'Aspiring Member',
    avatar: m.user_avatar || 'https://picsum.photos/seed/default/100/100',
    reason: "Applying to join.",
    timestamp: "Recently",
    category: 'General'
});

// Helper to map DB member to frontend PendingMember type (for Rejected)
const mapRejectedMember = (m: any): any => ({
    id: m.user_id || m.id,
    name: m.user_name || 'Declined Applicant',
    avatar: m.user_avatar || 'https://picsum.photos/seed/default/100/100',
    reason: "Application declined.",
    timestamp: "Previously",
    category: 'General'
});
