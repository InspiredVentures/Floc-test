import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { authService } from '../services/authService';
import { Profile } from '../types';

export interface AuthContextType {
    user: User | null;
    profile: Profile | null;
    isLoading: boolean;
    refreshProfile: () => Promise<void>;
    debugLogin: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                // 1. Try to get Real User from Supabase
                const { user, profile } = await authService.getCurrentUser() || {};

                if (user) {
                    setUser(user);
                    setProfile(profile as Profile || null);
                } else {
                    // 2. Fallback: Check for Persistent Mock User in LocalStorage
                    const storedMockUser = localStorage.getItem('mock_user');
                    const storedMockProfile = localStorage.getItem('mock_profile');
                    if (storedMockUser && storedMockProfile) {
                        console.log('[AuthContext] Restoring Mock User from LocalStorage');
                        setUser(JSON.parse(storedMockUser));
                        setProfile(JSON.parse(storedMockProfile));
                    } else {
                        setUser(null);
                        setProfile(null);
                    }
                }
            } catch (error) {
                console.error('[AuthContext] Error initializing auth:', error);
            } finally {
                setIsLoading(false);
            }
        };

        initializeAuth();

        // Listen for Auth Changes
        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_OUT') {
                setUser(null);
                setProfile(null);
                // Clear mock session on logout
                localStorage.removeItem('mock_user');
                localStorage.removeItem('mock_profile');
            } else if (event === 'SIGNED_IN' && session) {
                // Re-initialize to handle user loading
                initializeAuth();
            }
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    const refreshProfile = async () => {
        const { user, profile } = await authService.getCurrentUser() || {};
        setUser(user || null);
        setProfile(profile as Profile || null);
    };

    const debugLogin = () => {
        const mockUser: User = {
            id: 'dev-user-id',
            app_metadata: {},
            user_metadata: {},
            aud: 'authenticated',
            created_at: new Date().toISOString(),
        } as User;

        const mockProfile: Profile = {
            id: 'dev-user-id',
            username: 'dev_explorer',
            display_name: 'Dev Explorer',
            avatar_url: 'https://picsum.photos/seed/dev/200/200',
            bio: 'Local development user',
            location: 'Localhost',
            role: 'user'
        };

        setUser(mockUser);
        setProfile(mockProfile);

        // PERSIST MOCK SESSION
        localStorage.setItem('mock_user', JSON.stringify(mockUser));
        localStorage.setItem('mock_profile', JSON.stringify(mockProfile));
    };

    return (
        <AuthContext.Provider value={{
            user,
            profile,
            isLoading,
            refreshProfile,
            debugLogin
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
