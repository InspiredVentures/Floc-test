import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface BookingContextType {
    bookedTripIds: string[];
    bookTrip: (id: string) => void;
    isBooked: (id: string) => boolean;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [bookedTripIds, setBookedTripIds] = useState<string[]>(() => {
        try {
            const saved = localStorage.getItem('floc_booked_trips');
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (e) {
            console.error('Failed to load booked trips from localStorage:', e);
        }
        return [];
    });

    useEffect(() => {
        try {
            localStorage.setItem('floc_booked_trips', JSON.stringify(bookedTripIds));
        } catch (e) {
            console.error('Failed to save booked trips to localStorage:', e);
        }
    }, [bookedTripIds]);

    const bookTrip = (id: string) => {
        if (!bookedTripIds.includes(id)) {
            setBookedTripIds(prev => [...prev, id]);
        }
    };

    const isBooked = (id: string) => bookedTripIds.includes(id);

    return (
        <BookingContext.Provider value={{
            bookedTripIds,
            bookTrip,
            isBooked
        }}>
            {children}
        </BookingContext.Provider>
    );
};

export const useBooking = () => {
    const context = useContext(BookingContext);
    if (context === undefined) {
        throw new Error('useBooking must be used within a BookingProvider');
    }
    return context;
};
