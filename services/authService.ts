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
    }
};
