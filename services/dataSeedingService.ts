import { supabase } from '../lib/supabase';
import { MOCK_COMMUNITIES, MOCK_TRIPS } from '../constants';
import { Community, Trip } from '../types';

export const dataSeedingService = {
    /**
     * Seed the database with initial data from MOCK constants.
     * This is a "safe" seed - it checks if data exists before inserting to avoid duplicates
     * (or simple duplicates based on ID/Title).
     */
    async seedDatabase(onProgress: (status: string) => void): Promise<{ success: boolean; message: string }> {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                return { success: false, message: 'You must be logged in to seed data.' };
            }

            onProgress('Starting seed process...');

            // 1. Seed Communities
            onProgress('Seeding Communities...');
            let communitiesAdded = 0;

            for (const mockComm of MOCK_COMMUNITIES) {
                // Check if community exists
                const { data: existing } = await supabase
                    .from('communities')
                    .select('id')
                    .eq('title', mockComm.title)
                    .single();

                if (!existing) {
                    // Insert new community
                    // Note: We're not using the mock ID because Supabase generates UUIDs
                    // We'll rely on the title for mapping trips later
                    const { data: newComm, error } = await supabase
                        .from('communities')
                        .insert({
                            title: mockComm.title,
                            description: mockComm.description,
                            category: mockComm.category,
                            image: mockComm.image,
                            owner_id: user.id, // Current user becomes owner
                            access_type: mockComm.accessType,
                            meta: mockComm.meta,
                            member_count: mockComm.memberCount,
                            is_managed: mockComm.isManaged || false,
                            entry_questions: mockComm.entryQuestions || [],
                            enabled_features: mockComm.enabledFeatures || []
                        })
                        .select()
                        .single();

                    if (error) {
                        console.error(`Failed to insert community ${mockComm.title}:`, error);
                    } else if (newComm) {
                        communitiesAdded++;
                        // Add owner as a member
                        await supabase.from('community_members').insert({
                            community_id: newComm.id,
                            user_id: user.id,
                            user_name: user.user_metadata?.full_name || 'Admin',
                            role: 'Owner',
                            status: 'approved'
                        });

                        // 2. Seed Trips for this Community
                        // We find trips in MOCK_TRIPS that belong to this mock community ID
                        // OR trips embedded in the mock community object
                        const associatedTrips = [
                            ...(mockComm.upcomingTrips || []),
                            ...MOCK_TRIPS.filter(t => t.communityId === mockComm.id)
                        ];

                        // Deduplicate by ID
                        const uniqueTrips = Array.from(new Map(associatedTrips.map(t => [t.id, t])).values());

                        for (const trip of uniqueTrips) {
                            const { error: tripError } = await supabase.from('trips').insert({
                                title: trip.title,
                                destination: trip.destination,
                                dates: trip.dates,
                                price: trip.price,
                                image: trip.image,
                                status: trip.status,
                                members_count: trip.membersCount,
                                community_id: newComm.id, // Link to real new ID
                                wetravel_id: trip.wetravelId
                            });
                            if (tripError) console.error(`Failed to insert trip ${trip.title}:`, tripError);
                        }
                    }
                }
            }

            return {
                success: true,
                message: `Seeding complete! Added ${communitiesAdded} communities and their trips.`
            };

        } catch (err) {
            console.error('Seeding failed:', err);
            return { success: false, message: err instanceof Error ? err.message : 'Unknown seeding error' };
        }
    }
};
