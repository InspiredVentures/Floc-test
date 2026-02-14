import React, { useState } from 'react';
import { CommunityEvent } from '../types';

interface Props {
    events: CommunityEvent[];
    onRSVP: (eventId: string) => void;
    onAddEvent?: (event: Omit<CommunityEvent, 'id' | 'attendees' | 'isAttending'>) => void;
}

export const CommunityEvents: React.FC<Props> = ({ events, onRSVP, onAddEvent }) => {
    const [isCreating, setIsCreating] = useState(false);
    const [newEvent, setNewEvent] = useState({
        title: '',
        date: '',
        time: '',
        location: '',
        description: '',
        month: 'OCT', // Default for prototype
        day: '25'
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (onAddEvent) {
            onAddEvent(newEvent);
            setIsCreating(false);
            setNewEvent({ title: '', date: '', time: '', location: '', description: '', month: 'OCT', day: '25' });
        }
    };

    if (!isCreating && events.length === 0) {
        return (
            <div className="text-center py-8 bg-white/50 rounded-3xl border border-primary/5">
                <span className="material-symbols-outlined text-primary/20 text-3xl mb-2">event_busy</span>
                <p className="text-primary/40 text-[10px] font-black uppercase tracking-widest mb-3">No upcoming events</p>
                {onAddEvent && (
                    <button
                        onClick={() => setIsCreating(true)}
                        className="text-[9px] font-black uppercase tracking-widest text-accent hover:underline"
                    >
                        + Add Meetup
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {isCreating ? (
                <form onSubmit={handleSubmit} className="bg-slate-50 p-4 rounded-3xl border border-primary/10 space-y-3 animate-in fade-in slide-in-from-top-2">
                    <div className="flex justify-between items-center mb-2">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-primary">New Meetup</h4>
                        <button type="button" onClick={() => setIsCreating(false)} className="text-slate-400 hover:text-primary">
                            <span className="material-symbols-outlined text-base">close</span>
                        </button>
                    </div>
                    <input
                        type="text"
                        placeholder="Event Title"
                        className="w-full bg-white border border-primary/10 rounded-xl px-3 py-2 text-xs font-bold text-primary outline-none focus:border-accent"
                        required
                        value={newEvent.title}
                        onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
                    />
                    <div className="grid grid-cols-2 gap-2">
                        <input
                            type="text"
                            placeholder="Date (e.g. Oct 24)"
                            className="w-full bg-white border border-primary/10 rounded-xl px-3 py-2 text-xs text-primary outline-none focus:border-accent"
                            required
                            value={newEvent.date}
                            onChange={e => setNewEvent({ ...newEvent, date: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Time"
                            className="w-full bg-white border border-primary/10 rounded-xl px-3 py-2 text-xs text-primary outline-none focus:border-accent"
                            required
                            value={newEvent.time}
                            onChange={e => setNewEvent({ ...newEvent, time: e.target.value })}
                        />
                    </div>
                    <input
                        type="text"
                        placeholder="Location"
                        className="w-full bg-white border border-primary/10 rounded-xl px-3 py-2 text-xs text-primary outline-none focus:border-accent"
                        required
                        value={newEvent.location}
                        onChange={e => setNewEvent({ ...newEvent, location: e.target.value })}
                    />
                    <button
                        type="submit"
                        className="w-full bg-primary text-white font-black uppercase tracking-widest text-[9px] py-2 rounded-xl hover:bg-black transition-colors"
                    >
                        Create Meetup
                    </button>
                </form>
            ) : (
                <>
                    {onAddEvent && (
                        <div className="flex justify-end -mt-2 mb-2">
                            <button
                                onClick={() => setIsCreating(true)}
                                className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-accent hover:text-primary transition-colors"
                            >
                                <span className="material-symbols-outlined text-sm">add_circle</span>
                                Add Meetup
                            </button>
                        </div>
                    )}
                    {events.map(event => (
                        <div key={event.id} className="bg-white p-4 rounded-3xl border border-primary/5 shadow-sm hover:border-accent/30 transition-all group">
                            <div className="flex gap-4">
                                {/* Date Badge */}
                                <div className="flex flex-col items-center justify-center bg-primary/5 rounded-2xl w-14 h-14 shrink-0 border border-primary/10 group-hover:border-accent/20 group-hover:bg-accent/5 transition-colors">
                                    <span className="text-[9px] font-black text-primary/40 uppercase tracking-widest group-hover:text-accent/60">{event.month}</span>
                                    <span className="text-xl font-black text-primary group-hover:text-accent leading-none">{event.day}</span>
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h4 className="text-primary font-bold text-sm truncate group-hover:text-accent transition-colors">{event.title}</h4>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="flex items-center gap-1 text-[10px] text-slate-500 font-medium">
                                            <span className="material-symbols-outlined text-[10px]">schedule</span>
                                            {event.time}
                                        </span>
                                        <span className="w-0.5 h-0.5 bg-slate-300 rounded-full"></span>
                                        <span className="flex items-center gap-1 text-[10px] text-slate-500 font-medium truncate">
                                            <span className="material-symbols-outlined text-[10px]">location_on</span>
                                            {event.location}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-3 flex items-center justify-between border-t border-primary/5 pt-3">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="size-6 rounded-full bg-slate-200 border-2 border-white"></div>
                                    ))}
                                    <div className="size-6 rounded-full bg-primary/10 border-2 border-white flex items-center justify-center text-[8px] font-black text-primary">+{event.attendees}</div>
                                </div>

                                <button
                                    onClick={() => onRSVP(event.id)}
                                    className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border transition-all ${event.isAttending
                                        ? 'bg-green-100 text-green-700 border-green-200'
                                        : 'bg-primary text-white border-primary hover:bg-accent hover:border-accent'}`}
                                >
                                    {event.isAttending ? 'Going' : 'RSVP'}
                                </button>
                            </div>
                        </div>
                    ))}
                </>
            )}
        </div>
    );
};
