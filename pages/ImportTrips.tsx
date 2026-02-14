import React, { useState } from 'react';
import { supabaseService } from '../services/supabaseService';
import { Trip } from '../types';

const ImportTrips: React.FC = () => {
    const [jsonInput, setJsonInput] = useState('');
    const [status, setStatus] = useState<string>('');
    const [isImporting, setIsImporting] = useState(false);

    const handleImport = async () => {
        try {
            setIsImporting(true);
            setStatus('Parsing JSON...');

            let trips: any[] = [];
            try {
                trips = JSON.parse(jsonInput);
                if (!Array.isArray(trips)) {
                    // Try to handle if it's wrapped in an object
                    if (trips && typeof trips === 'object' && 'trips' in trips) {
                        trips = (trips as any).trips;
                    } else {
                        throw new Error('Input is not an array of trips');
                    }
                }
            } catch (e) {
                setStatus('Error: Invalid JSON format.');
                setIsImporting(false);
                return;
            }

            setStatus(`Found ${trips.length} trips. Starting import...`);

            let successCount = 0;
            let failCount = 0;

            for (const tripData of trips) {
                // Map WeTravel/JSON fields to our Trip type if necessary
                // Assuming JSON matches Trip type mostly or needs simple mapping
                const trip: Omit<Trip, 'id'> = {
                    title: tripData.title || tripData.name || 'Untitled Trip',
                    // description: tripData.description || '', // Removed as it's not in Trip type
                    dates: tripData.date || tripData.startDate || 'TBD',
                    destination: tripData.location || tripData.destination || 'Unknown',
                    price: tripData.price || '0',
                    image: tripData.image || tripData.imageUrl || 'https://picsum.photos/seed/travel/800/600',
                    membersCount: parseInt(tripData.spotsBooked || '0'), // Mapping spotsBooked to membersCount roughly
                    // spotsTotal: parseInt(tripData.spotsTotal || tripData.capacity || '10'), // Removed
                    // spotsBooked: parseInt(tripData.spotsBooked || '0'), // Removed
                    communityId: tripData.communityId || 'global', // vital
                    // organizerId: 'dev-user-id', // Removed
                    status: 'CONFIRMED'
                };

                const result = await supabaseService.createTrip(trip, 'dev-user-id');
                if (result) {
                    successCount++;
                } else {
                    failCount++;
                }
                setStatus(`Importing... ${successCount} success, ${failCount} failed`);
            }

            setStatus(`Done! Imported ${successCount} trips. (${failCount} failed)`);

        } catch (e: any) {
            setStatus('Error: ' + e.message);
            console.error(e);
        } finally {
            setIsImporting(false);
        }
    };

    return (
        <div className="min-h-screen bg-background-dark p-8 pb-32">
            <h1 className="text-3xl font-black text-white mb-6">Import Trips</h1>

            <div className="max-w-4xl mx-auto space-y-6">
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                    <label className="block text-slate-400 text-sm font-bold mb-2">
                        Paste JSON Data (Array of Trips)
                    </label>
                    <textarea
                        value={jsonInput}
                        onChange={e => setJsonInput(e.target.value)}
                        className="w-full h-96 bg-black/50 text-xs font-mono text-green-400 p-4 rounded-xl border border-white/10 focus:border-primary outline-none"
                        placeholder='[{"title": "Bali Retreat", "date": "2024-05-01", ...}]'
                    />
                </div>

                <div className="flex items-center justify-between">
                    <div className="text-white font-mono text-sm">
                        {status}
                    </div>
                    <button
                        onClick={handleImport}
                        disabled={isImporting || !jsonInput}
                        className={`px-8 py-4 rounded-xl font-black uppercase tracking-widest transition-all ${isImporting || !jsonInput
                            ? 'bg-white/10 text-slate-500 cursor-not-allowed'
                            : 'bg-primary text-background-dark hover:scale-105 shadow-lg shadow-primary/20'
                            }`}
                    >
                        {isImporting ? 'Importing...' : 'Run Import'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ImportTrips;
