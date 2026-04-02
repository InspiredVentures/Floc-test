import { supabase } from '../lib/supabase';
import { User } from '../types';

export const authService = {
    async signInWithEmail(email: string) {
        const { data, error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                shouldCreateUser: true, // Auto-signup for now for ease of use
            },
        });
        return { data, error };
    },

    async signInWithGoogle() {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/onboarding`
            }
        });
        return { data, error };
    },

    async signInWithProtocol() {
        // Simulate protocol handshake
        await new Promise(resolve => setTimeout(resolve, 1500));

        try {
            // 1. Authenticate anonymously as a Protocol Node
            const { data, error } = await supabase.auth.signInAnonymously();

            if (error) {
                return { data: null, error };
            }

            // 2. Assign Protocol Identity (Metadata)
            if (data?.user) {
                const { error: updateError } = await supabase.auth.updateUser({
                    data: {
                        full_name: 'Protocol Node',
                        avatar_url: 'https://img.icons8.com/fluency/96/security-shield-green.png',
                        is_protocol_user: true
                    }
                });

                if (updateError) {
                    console.warn('Failed to update protocol user metadata:', updateError);
                    // Continue anyway, as we are authenticated
                }
            }

            return { data, error: null };
        } catch (err: any) {
             return { data: null, error: err };
        }
    },

    async signOut() {
        const { error } = await supabase.auth.signOut();
        return { error };
    },

    async getCurrentUser() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;

        // Fetch profile
        let { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (error && error.code === 'PGRST116') {
            const newProfile = {
                id: user.id,
                username: user.email?.split('@')[0] || 'user',
                full_name: user.user_metadata?.full_name || '',
                avatar_url: user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`,
                updated_at: new Date().toISOString()
            };

            const { data: createdProfile, error: createError } = await supabase
                .from('profiles')
                .insert(newProfile)
                .select()
                .single();

            if (!createError) {
                profile = createdProfile;
            } else {
                console.error('Error creating profile for user:', createError);
            }
        }

        return { user, profile };
    },

    async getSession() {
        const { data: { session } } = await supabase.auth.getSession();
        return session;
    },

    async signInAnonymously() {
        const { data, error } = await supabase.auth.signInAnonymously();
        return { data, error };
    },

    async signInWithGoogle() {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                queryParams: {
                    access_type: 'offline',
                    prompt: 'consent',
                },
                redirectTo: window.location.origin,
            },
        });
        return { data, error };
    }
};
