import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { AppNotification } from '../types';

export interface NotificationContextType {
    notifications: AppNotification[];
    addNotification: (notification: Omit<AppNotification, 'id' | 'timestamp' | 'isRead'>) => void;
    markNotificationsAsRead: () => void;
    deleteNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Load notifications from localStorage
    const [notifications, setNotifications] = useState<AppNotification[]>(() => {
        try {
            const saved = localStorage.getItem('floc_notifications');
            if (saved) return JSON.parse(saved);
        } catch (e) {
            console.error('Failed to load notifications:', e);
        }
        return [];
    });

    // Save notifications to localStorage
    useEffect(() => {
        try {
            localStorage.setItem('floc_notifications', JSON.stringify(notifications));
        } catch (e) {
            console.error('Failed to save notifications:', e);
        }
    }, [notifications]);

    const addNotification = (data: Omit<AppNotification, 'id' | 'timestamp' | 'isRead'>) => {
        const newNotification: AppNotification = {
            ...data,
            id: `notif-${Date.now()}`,
            timestamp: Date.now(),
            isRead: false
        };
        setNotifications(prev => [newNotification, ...prev]);
    };

    const markNotificationsAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    };

    const deleteNotification = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    return (
        <NotificationContext.Provider value={{
            notifications,
            addNotification,
            markNotificationsAsRead,
            deleteNotification
        }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};
