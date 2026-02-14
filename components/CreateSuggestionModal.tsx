
import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { communityService } from '../services/communityService';
import { useToast } from '../contexts/ToastContext';

interface CreateSuggestionModalProps {
    isOpen: boolean;
    onClose: () => void;
    communityId: string;
    onSuggestionCreated: (newSuggestion: any) => void;
}

export const CreateSuggestionModal: React.FC<CreateSuggestionModalProps> = ({
    isOpen,
    onClose,
    communityId,
    onSuggestionCreated
}) => {
    const { user } = useUser();
    const { success: successToast, error: errorToast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form State
    const [destination, setDestination] = useState('');
    const [budget, setBudget] = useState<'Eco' | 'Mid' | 'Luxury'>('Mid');
    const [style, setStyle] = useState('Adventure');
    const [duration, setDuration] = useState('7 Days');
    const [ingredients, setIngredients] = useState('');
    const [travelFrom, setTravelFrom] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setIsSubmitting(true);
        try {
            const newSuggestion = await communityService.createSuggestion({
                communityId,
                userId: user.id,
                userName: user.email?.split('@')[0] || 'Member',
                userAvatar: 'https://picsum.photos/seed/user/100/100',
                destination,
                budgetTier: budget,
                style,
                duration,
                ingredients: ingredients.split(',').map(i => i.trim()).filter(Boolean),
                travelFrom
            });

            if (newSuggestion) {
                successToast('Trip pitch posted successfully!');
                onSuggestionCreated(newSuggestion);
                onClose();
                // Reset form
                setDestination('');
                setBudget('Mid');
                setStyle('Adventure');
                setDuration('7 Days');
                setIngredients('');
                setTravelFrom('');
            } else {
                errorToast('Failed to post trip pitch.');
            }
        } catch (error) {
            console.error('Error creating suggestion:', error);
            errorToast('An error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>

            {/* Modal */}
            <div className="relative w-full max-w-lg bg-[#FCFBF5] rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="bg-primary px-6 py-5 flex items-center justify-between">
                    <div>
                        <h3 className="text-white text-lg font-black italic tracking-wide">Pitch a Trip</h3>
                        <p className="text-white/60 text-[10px] uppercase font-bold tracking-widest">Propose the next adventure</p>
                    </div>
                    <button onClick={onClose} className="text-white/60 hover:text-white transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Destination */}
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-primary/60 pl-1">Destination</label>
                            <input
                                type="text"
                                value={destination}
                                onChange={(e) => setDestination(e.target.value)}
                                placeholder="Where should we go? (e.g. Costa Rica)"
                                className="w-full bg-white border border-primary/10 rounded-xl px-4 py-3 text-primary text-sm font-bold focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all placeholder:font-normal"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Duration */}
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-primary/60 pl-1">Duration</label>
                                <select
                                    value={duration}
                                    onChange={(e) => setDuration(e.target.value)}
                                    className="w-full bg-white border border-primary/10 rounded-xl px-4 py-3 text-primary text-sm font-bold focus:border-primary outline-none appearance-none"
                                >
                                    <option>3-5 Days</option>
                                    <option>7 Days</option>
                                    <option>10-14 Days</option>
                                    <option>3+ Weeks</option>
                                </select>
                            </div>

                            {/* Style */}
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-primary/60 pl-1">Travel Style</label>
                                <select
                                    value={style}
                                    onChange={(e) => setStyle(e.target.value)}
                                    className="w-full bg-white border border-primary/10 rounded-xl px-4 py-3 text-primary text-sm font-bold focus:border-primary outline-none appearance-none"
                                >
                                    <option>Adventure</option>
                                    <option>Relaxation</option>
                                    <option>Cultural</option>
                                    <option>Volunteer</option>
                                    <option>Party</option>
                                </select>
                            </div>
                        </div>

                        {/* Budget */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-primary/60 pl-1">Target Budget</label>
                            <div className="grid grid-cols-3 gap-2">
                                {(['Eco', 'Mid', 'Luxury'] as const).map((b) => (
                                    <button
                                        key={b}
                                        type="button"
                                        onClick={() => setBudget(b)}
                                        className={`py-3 rounded-xl border text-xs font-black uppercase tracking-wider transition-all ${budget === b
                                                ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20'
                                                : 'bg-white border-primary/10 text-primary/50 hover:bg-primary/5'
                                            }`}
                                    >
                                        {b}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Ingredients (Optional) */}
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-primary/60 pl-1">Must-Haves (Optional)</label>
                            <textarea
                                value={ingredients}
                                onChange={(e) => setIngredients(e.target.value)}
                                placeholder="e.g. Scuba diving, Yoga, Local food (comma separated)"
                                className="w-full bg-white border border-primary/10 rounded-xl px-4 py-3 text-primary text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all resize-none h-20"
                            />
                        </div>

                        {/* Travel From (Optional) */}
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-primary/60 pl-1">Departing From (Optional)</label>
                            <input
                                type="text"
                                value={travelFrom}
                                onChange={(e) => setTravelFrom(e.target.value)}
                                placeholder="e.g. New York / Any Major Hub"
                                className="w-full bg-white border border-primary/10 rounded-xl px-4 py-3 text-primary text-sm focus:border-primary outline-none transition-all"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting || !destination}
                            className="w-full bg-primary text-white font-black py-4 rounded-xl shadow-xl shadow-primary/20 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4 flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
                                    Launching...
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined text-lg">rocket_launch</span>
                                    Launch Proposal
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};
