import React, { ReactNode } from 'react';
import { AuthProvider, useAuth, AuthContextType } from './AuthContext';
import { CommunityProvider, useCommunity, CommunityContextType } from './CommunityContext';
import { SocialProvider, useSocial, SocialContextType } from './SocialContext';
import { BookingProvider, useBooking, BookingContextType } from './BookingContext';
import { MessagingProvider, useMessaging, MessagingContextType } from './MessagingContext';
import { NotificationProvider, useNotification, NotificationContextType } from './NotificationContext';

// Re-export types that might be needed by consumers (optional, but good practice)
export type { AuthContextType, CommunityContextType, SocialContextType, BookingContextType, MessagingContextType, NotificationContextType };

// Combined Interface
export interface UserContextType extends
    AuthContextType,
    CommunityContextType,
    SocialContextType,
    BookingContextType,
    MessagingContextType,
    NotificationContextType {}

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <AuthProvider>
            <NotificationProvider>
                <SocialProvider>
                    <BookingProvider>
                        <CommunityProvider>
                            <MessagingProvider>
                                {children}
                            </MessagingProvider>
                        </CommunityProvider>
                    </BookingProvider>
                </SocialProvider>
            </NotificationProvider>
        </AuthProvider>
    );
};

export const useUser = (): UserContextType => {
    const auth = useAuth();
    const notification = useNotification();
    const social = useSocial();
    const booking = useBooking();
    const community = useCommunity();
    const messaging = useMessaging();

    return {
        ...auth,
        ...notification,
        ...social,
        ...booking,
        ...community,
        ...messaging
    };
};
