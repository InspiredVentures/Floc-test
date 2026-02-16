
import { Trip, TripSuggestion } from '../types';
import { MOCK_TRIPS } from '../constants';

// Based on WeTravel Partner API docs (simulated structure)
// https://wetravel.com/api-docs (Not publicly open without login, so inferring common patterns)

interface WeTravelTripDetail {
    id: string; // "wt-123"
    title: string;
    start_date: string;
    end_date: string;
    price: { currency: string; amount: number };
    status: 'published' | 'draft';
    description: string;
    image_url: string;
    spots_total: number;
    spots_taken: number;
}

export interface BookingRequest {
    tripId: string;
    traveler: {
        firstName: string;
        lastName: string;
        email: string;
    };
    paymentMethod?: 'credit_card' | 'bank_transfer';
}

export interface BookingResponse {
    success: boolean;
    bookingId?: string;
    paymentUrl?: string; // Redirect URL for Stripe/WeTravel payment page
    error?: string;
}

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'; // Set to false when you have a WeTravel Partner API key configured on the server
const USE_MOCK = true; // Set to false when you have a WeTravel Partner API key configured on the server
const API_BASE = '/api/wetravel'; // Use local proxy to avoid CORS

export const WeTravelService = {
    // Fetch trip details (GET /trips/:id)
    getTrip: async (tripId: string): Promise<Trip | null> => {
        // Fallback to mock if USE_MOCK is true
        if (USE_MOCK) {
            console.warn('Using Mock Data for WeTravel Service (USE_MOCK=true)');
            await new Promise(resolve => setTimeout(resolve, 800));
            const trip = MOCK_TRIPS.find(t => t.id === tripId);
            if (!trip) return null;
            return trip;
        }

        const apiUrl = `${API_BASE}/trips/${tripId}`;


        try {
            const response = await fetch(apiUrl, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                if (response.status === 404) {
                    return null;
                }
                const errorText = await response.text();
                throw new Error(`WeTravel API Error: ${response.statusText} - ${errorText}`);
            }

            const data = await response.json();

            // Transform WeTravel data to our Trip type
            return {
                id: data.id.toString(), // Ensure ID is string
                title: data.title,
                destination: data.location || 'Unknown',
                dates: `${data.start_date} - ${data.end_date}`,
                price: data.price ? `${data.price.currency} ${data.price.amount}` : 'TBD',
                image: data.image_url || '',
                status: data.status === 'published' ? 'CONFIRMED' : 'PLANNING',
                membersCount: data.spots_taken || 0,
                wetravelId: data.id.toString()
            };
        } catch (error) {
            console.error('[WeTravel] Fetch Error:', error);
            return null;
        }
    },

    // Create a booking (POST /bookings)
    createBooking: async (request: BookingRequest): Promise<BookingResponse> => {
        // Fallback to mock if USE_MOCK is true
        if (USE_MOCK) {
            await new Promise(resolve => setTimeout(resolve, 1500));
            // Simulate successful booking
            return {
                success: true,
                bookingId: `wt-bk-${Date.now()}`,
                paymentUrl: 'https://staging.wetravel.com/checkout/demo-session-123'
            };
        }

        try {
            const response = await fetch(`${API_BASE}/bookings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(request)
            });

            const data = await response.json();

            if (!response.ok) {
                return { success: false, error: data.message || 'Booking failed' };
            }

            return {
                success: true,
                bookingId: data.id,
                paymentUrl: data.payment_link
            };
        } catch (error) {
            console.error('WeTravel Booking Error:', error);
            return { success: false, error: 'Booking failed due to network error.' };
        }
    },

    // Get all trips (GET /trips)
    getAllTrips: async (): Promise<Trip[]> => {
        // Fallback to mock if USE_MOCK is true
        if (USE_MOCK) {
            console.warn('Using Mock Data for WeTravel Service (USE_MOCK=true)');
            await new Promise(resolve => setTimeout(resolve, 800));
            return MOCK_TRIPS;
        }

        const apiUrl = `${API_BASE}/trips`;
        // console.log('[WeTravel] Fetching all trips from', apiUrl);

        try {
            const response = await fetch(apiUrl, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            // console.log('[WeTravel] Response status:', response.status, response.statusText);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('[WeTravel] API Error Response:', errorText);
                throw new Error(`WeTravel API Error: ${response.statusText}`);
            }

            const data = await response.json();
            // console.log('[WeTravel] API Response:', data);

            // WeTravel API might return trips in different formats
            // Handle both array and object with trips property
            const trips = Array.isArray(data) ? data : (data.trips || data.data || []);

            // Transform WeTravel data to our Trip type
            return trips.map((item: any) => ({
                id: item.id?.toString() || item.uuid?.toString(),
                title: item.title || item.name,
                destination: item.location || item.destination || 'Unknown',
                dates: item.start_date && item.end_date
                    ? `${item.start_date} - ${item.end_date}`
                    : 'TBD',
                price: item.price
                    ? `${item.price.currency || '$'} ${item.price.amount}`
                    : 'TBD',
                image: item.image_url || item.cover_image || '',
                status: item.status === 'published' ? 'CONFIRMED' : 'PLANNING',
                membersCount: item.spots_taken || item.bookings_count || 0,
                wetravelId: item.id?.toString() || item.uuid?.toString()
            })).filter((trip: any) => trip.id); // Filter out any invalid trips
        } catch (error) {
            console.error('[WeTravel] Fetch All Trips Error:', error);
            // Return mock data as fallback on error
            console.warn('[WeTravel] Falling back to mock data');
            return MOCK_TRIPS;
        }
    }
};
