
import React, { useState, useEffect } from 'react';
import { Trip } from '../types';

interface Props {
  trip: Trip;
  onBack: () => void;
  onBook: () => void;
}

interface ItineraryDay {
  day: number;
  title: string;
  content: string;
  tags: string[];
  completed: boolean;
}

interface SuggestionComment {
  id: string;
  user: string;
  avatar: string;
  text: string;
  time: string;
}

interface ActivitySuggestion {
  id: string;
  title: string;
  description: string;
  suggestedBy: string;
  avatar: string;
  votes: number;
  hasVoted: boolean;
  comments: SuggestionComment[];
}

const TripDetails: React.FC<Props> = ({ trip, onBack, onBook }) => {
  const [itinerary, setItinerary] = useState<ItineraryDay[]>([
    { 
      day: 1, 
      title: "Arrival & Welcome", 
      content: `Arrive at the destination. Private eco-transfer to our locally managed resort. Evening welcome circle and traditional dinner.`,
      tags: ["Dinner Included", "Transfer"],
      completed: true 
    },
    { 
      day: 2, 
      title: "Local Heritage Trek", 
      content: "A moderate 4-hour trek through historic sites and nature trails. Experience authentic local life and have lunch with a village family.",
      tags: ["Lunch Included", "Active"],
      completed: false 
    },
    { 
      day: 3, 
      title: "Community Conservation", 
      content: "Spend the day at a local conservation center. Learn about biology and help with local sustainability projects.",
      tags: ["Volunteering", "Eco"],
      completed: false 
    },
    { 
      day: 4, 
      title: "Nature Photography", 
      content: "Journey to hidden natural wonders. Visit three of the area's most beautiful spots and stay in a community-run lodge.",
      tags: ["Nature", "Photography"],
      completed: false 
    },
  ]);

  const [suggestions, setSuggestions] = useState<ActivitySuggestion[]>([
    {
      id: 's1',
      title: 'Sunrise Guided Session',
      description: 'A 4 AM start to reach the best vantage point for sunrise. Highly recommended for photography lovers.',
      suggestedBy: 'Sarah J.',
      avatar: 'https://picsum.photos/seed/sarah/100/100',
      votes: 12,
      hasVoted: false,
      comments: [
        { id: 'c1', user: 'Mike R.', avatar: 'https://picsum.photos/seed/mike/100/100', text: 'Sounds intense but worth it!', time: '2h ago' },
        { id: 'c2', user: 'Elena V.', avatar: 'https://picsum.photos/seed/elena/100/100', text: 'I have a portable kit I can bring.', time: '1h ago' }
      ]
    },
    {
      id: 's2',
      title: 'Local Craft Workshop',
      description: 'Learn from local artisans in a small-group setting. Perfect for sustainable souvenirs.',
      suggestedBy: 'Alex S.',
      avatar: 'https://picsum.photos/seed/alex/100/100',
      votes: 4,
      hasVoted: true,
      comments: []
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const toggleComplete = (dayNum: number) => {
    setItinerary(prev => prev.map(item => 
      item.day === dayNum ? { ...item, completed: !item.completed } : item
    ));
  };

  const handleVote = (id: string) => {
    setSuggestions(prev => prev.map(s => {
      if (s.id === id) {
        return { 
          ...s, 
          votes: s.hasVoted ? s.votes - 1 : s.votes + 1,
          hasVoted: !s.hasVoted 
        };
      }
      return s;
    }));
  };

  const addSuggestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const newSug: ActivitySuggestion = {
      id: Date.now().toString(),
      title: newTitle,
      description: newDesc,
      suggestedBy: 'Alex Sterling',
      avatar: 'https://picsum.photos/seed/alex/100/100',
      votes: 1,
      hasVoted: true,
      comments: []
    };
    setSuggestions([newSug, ...suggestions]);
    setNewTitle('');
    setNewDesc('');
    setShowAddModal(false);
  };

  return (
    <div className="relative flex flex-col min-h-screen">
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-gradient-to-b from-black/60 to-transparent">
        <button onClick={onBack} className="bg-white/10 backdrop-blur-md text-white p-2 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </button>
        <div className="flex gap-2">
          <button className="bg-white/10 backdrop-blur-md text-white p-2 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
            <span className="material-symbols-outlined">share</span>
          </button>
          <button className="bg-white/10 backdrop-blur-md text-white p-2 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
            <span className="material-symbols-outlined">favorite</span>
          </button>
        </div>
      </header>

      <div className="relative h-[420px] w-full overflow-hidden shrink-0">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `linear-gradient(0deg, rgba(16,34,22,1) 0%, rgba(16,34,22,0.4) 40%, rgba(16,34,22,0) 100%), url('${trip.image}')` }}></div>
        <div className="absolute bottom-6 left-4 right-4">
          <div className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-md border border-primary/30 px-3 py-1 rounded-full mb-3">
            <span className="material-symbols-outlined text-primary text-sm">verified</span>
            <p className="text-white text-xs font-bold uppercase tracking-wider">Powered by Inspired Ventures</p>
          </div>
          <h1 className="text-white text-4xl font-bold leading-tight">{trip.title}</h1>
          <div className="flex items-center gap-2 mt-2">
            <span className="material-symbols-outlined text-primary text-sm">location_on</span>
            <p className="text-white/80 text-sm">{trip.destination}</p>
          </div>
        </div>
      </div>

      <main className="flex flex-col gap-6 px-4 pb-32 -mt-2 relative z-10 bg-background-dark rounded-t-xl pt-6">
        <div className="grid grid-cols-3 gap-3">
          <StatBox icon="schedule" label="Duration" value="10 Days" />
          <StatBox icon="calendar_month" label="Dates" value={trip.dates.split('—')[0]} />
          <StatBox icon="group" label="Status" value={`${trip.membersCount} Tribe`} />
        </div>

        <section>
          <h2 className="text-xl font-bold mb-2">About the Trip</h2>
          <p className="text-slate-300 leading-relaxed text-sm">
            Join the Floc community for an immersive journey into the heart of {trip.destination}. We're partnering with Inspired Ventures to bring you a carbon-neutral adventure focusing on sustainable experiences and local sanctuary volunteering.
          </p>
        </section>

        {/* Tribe Suggestions Section */}
        <section className="bg-white/5 border border-white/10 rounded-2xl p-4 overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-white">Community Lab</h2>
              <p className="text-xs text-slate-400">Suggest & vote on tribe activities</p>
            </div>
            <button 
              onClick={() => setShowAddModal(true)}
              className="bg-primary/10 text-primary p-2 rounded-full hover:bg-primary/20 transition-all border border-primary/20"
            >
              <span className="material-symbols-outlined">add</span>
            </button>
          </div>

          <div className="space-y-4">
            {suggestions.map((sug) => (
              <SuggestionCard key={sug.id} suggestion={sug} onVote={() => handleVote(sug.id)} />
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Confirmed Itinerary</h2>
            <p className="text-xs font-bold text-primary uppercase tracking-widest">
              {itinerary.filter(i => i.completed).length}/{itinerary.length} Completed
            </p>
          </div>
          <div className="space-y-3">
            {itinerary.map((item) => (
              <ItineraryItem 
                key={item.day} 
                item={item} 
                onToggleComplete={() => toggleComplete(item.day)}
                defaultExpanded={item.day === 1}
              />
            ))}
          </div>
        </section>

        <section className="fixed bottom-0 left-0 right-0 z-50 p-4 pb-8 bg-background-dark/90 backdrop-blur-xl border-t border-white/10 max-w-md mx-auto">
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-white">{trip.price}</span>
                <span className="text-slate-500 text-xs font-medium">/ person</span>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-slate-400 uppercase font-bold tracking-tight">
                <span className="material-symbols-outlined text-xs text-primary fill-1">lock</span>
                Secure Booking
              </div>
            </div>
            <button 
              onClick={onBook}
              className="flex-1 bg-primary text-background-dark h-14 rounded-full font-bold text-lg shadow-[0_8px_30px_rgb(19,236,91,0.3)] active:scale-[0.98] transition-transform"
            >
              Book Now
            </button>
          </div>
        </section>
      </main>

      {/* Suggestion Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-background-dark w-full max-w-md rounded-t-3xl p-6 border-t border-white/10 animate-in slide-in-from-bottom duration-500">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Suggest Activity</h2>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={addSuggestion} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Activity Name</label>
                <input 
                  type="text" 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Local Food Market Tour"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Description</label>
                <textarea 
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Why should the tribe do this together?"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none transition-all resize-none"
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-primary text-background-dark font-bold py-4 rounded-xl shadow-lg shadow-primary/20 active:scale-95 transition-all mt-4"
              >
                Post Suggestion
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const StatBox: React.FC<{ icon: string; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex flex-col items-center text-center">
    <span className="material-symbols-outlined text-primary mb-1">{icon}</span>
    <p className="text-xs text-slate-400">{label}</p>
    <p className="text-sm font-bold text-white">{value}</p>
  </div>
);

const SuggestionCard: React.FC<{ suggestion: ActivitySuggestion; onVote: () => void }> = ({ suggestion, onVote }) => {
  const [showComments, setShowComments] = useState(false);

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4 transition-all">
      <div className="flex gap-3">
        <div className="flex flex-col items-center gap-1">
          <button 
            onClick={onVote}
            className={`flex flex-col items-center justify-center size-10 rounded-xl transition-all ${suggestion.hasVoted ? 'bg-primary text-background-dark' : 'bg-white/5 text-slate-400 hover:text-white'}`}
          >
            <span className="material-symbols-outlined text-sm font-bold">stat_1</span>
            <span className="text-xs font-bold leading-none">{suggestion.votes}</span>
          </button>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <img src={suggestion.avatar} className="size-5 rounded-full object-cover" alt="" />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{suggestion.suggestedBy}</span>
            {suggestion.votes > 10 && (
              <span className="bg-yellow-500/20 text-yellow-500 text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded border border-yellow-500/30">Trending</span>
            )}
          </div>
          <h4 className="text-white font-bold leading-tight">{suggestion.title}</h4>
          <p className="text-xs text-slate-400 mt-1 line-clamp-2">{suggestion.description}</p>
          
          <div className="flex items-center gap-4 mt-3">
            <button 
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-1.5 text-slate-500 hover:text-white transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">forum</span>
              <span className="text-[10px] font-bold uppercase tracking-widest">{suggestion.comments.length} Comments</span>
            </button>
            <button className="flex items-center gap-1.5 text-slate-500 hover:text-white transition-all">
              <span className="material-symbols-outlined text-[16px]">share</span>
              <span className="text-[10px] font-bold uppercase tracking-widest">Share</span>
            </button>
          </div>
        </div>
      </div>

      {showComments && (
        <div className="mt-4 pt-4 border-t border-white/5 space-y-3 animate-in fade-in slide-in-from-top-1 duration-300">
          {suggestion.comments.length === 0 ? (
            <p className="text-[10px] text-slate-600 italic">No comments yet. Start the conversation!</p>
          ) : (
            suggestion.comments.map(comment => (
              <div key={comment.id} className="flex gap-2">
                <img src={comment.avatar} className="size-6 rounded-full shrink-0" alt="" />
                <div className="bg-white/5 rounded-lg p-2 flex-1">
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="text-[9px] font-bold text-slate-300">{comment.user}</span>
                    <span className="text-[8px] text-slate-500 uppercase tracking-tighter">{comment.time}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">{comment.text}</p>
                </div>
              </div>
            ))
          )}
          <div className="flex gap-2 items-center mt-2">
            <img src="https://picsum.photos/seed/alex/100/100" className="size-6 rounded-full" alt="" />
            <input 
              type="text" 
              placeholder="Write a comment..."
              className="flex-1 bg-white/5 border border-white/10 rounded-full px-3 py-1.5 text-[11px] text-white focus:border-primary outline-none transition-all"
            />
          </div>
        </div>
      )}
    </div>
  );
};

const ItineraryItem: React.FC<{ 
  item: ItineraryDay; 
  onToggleComplete: () => void; 
  defaultExpanded: boolean; 
}> = ({ item, onToggleComplete, defaultExpanded }) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [celebrating, setCelebrating] = useState(false);

  // Trigger celebration effect when item becomes completed
  useEffect(() => {
    if (item.completed) {
      setCelebrating(true);
      const timer = setTimeout(() => setCelebrating(false), 800);
      return () => clearTimeout(timer);
    }
  }, [item.completed]);

  return (
    <div className={`relative border transition-all duration-300 ${expanded ? 'border-primary bg-primary/5' : 'border-white/10 bg-white/5'} rounded-xl p-4 overflow-hidden`}>
      {/* Background celebration pulse */}
      {celebrating && (
        <div className="absolute inset-0 bg-primary/10 animate-pulse pointer-events-none"></div>
      )}

      <div className="flex items-start justify-between gap-3 relative z-10">
        <div className="flex items-center gap-3 flex-1 cursor-pointer" onClick={() => setExpanded(!expanded)}>
          <div className="relative">
            <div className={`transition-all duration-300 ${item.completed ? 'bg-primary text-background-dark scale-110 shadow-[0_0_15px_rgba(19,236,91,0.5)]' : (expanded ? 'bg-primary/20 text-primary border border-primary/50' : 'bg-white/10 text-slate-400')} h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${celebrating ? 'animate-bounce' : ''}`}>
              {item.completed ? (
                <span className="material-symbols-outlined text-[18px] font-bold">check</span>
              ) : (
                item.day
              )}
            </div>

            {/* Sparkle particles */}
            {celebrating && (
              <>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-1 bg-yellow-400 rounded-full animate-sparkle-1"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-1 bg-primary rounded-full animate-sparkle-2"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-1 bg-white rounded-full animate-sparkle-3"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-1 bg-yellow-200 rounded-full animate-sparkle-4"></div>
              </>
            )}

            {item.completed && !expanded && !celebrating && (
               <div className="absolute -top-1 -right-1 size-3 bg-primary rounded-full border-2 border-background-dark"></div>
            )}
          </div>
          <div className="flex flex-col">
            <h3 className={`font-bold transition-all ${item.completed && !expanded ? 'text-slate-500 line-through decoration-primary/40' : (expanded ? 'text-white' : 'text-slate-300')}`}>
              {item.title}
            </h3>
            {item.completed && !expanded && (
              <span className={`text-[10px] text-primary font-bold uppercase tracking-widest mt-0.5 ${celebrating ? 'animate-bounce' : ''}`}>
                {celebrating ? 'Boom! Done.' : 'Completed'}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2 shrink-0">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onToggleComplete();
            }}
            className={`flex items-center justify-center size-8 rounded-full transition-all ${item.completed ? 'bg-primary/20 text-primary' : 'bg-white/5 text-slate-500 hover:text-primary'} ${celebrating ? 'scale-125' : ''}`}
            title={item.completed ? "Mark as incomplete" : "Mark as complete"}
          >
            <span className={`material-symbols-outlined text-[20px] ${item.completed ? 'fill-1' : ''}`}>
              {item.completed ? 'check_circle' : 'circle'}
            </span>
          </button>
          <button onClick={() => setExpanded(!expanded)} className="text-slate-500 hover:text-white transition-colors">
            <span className="material-symbols-outlined text-[24px]">
              {expanded ? 'expand_less' : 'expand_more'}
            </span>
          </button>
        </div>
      </div>
      
      {expanded && (
        <div className="mt-4 pl-11 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300 relative z-10">
          <p className="text-sm text-slate-300 leading-relaxed">{item.content}</p>
          <div className="flex flex-wrap gap-2">
            {item.tags.map(tag => (
              <span key={tag} className="bg-white/10 border border-white/5 px-2 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider text-slate-300">
                {tag}
              </span>
            ))}
          </div>
          <button 
            onClick={onToggleComplete}
            className={`w-full py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${item.completed ? 'bg-slate-800 text-slate-400' : 'bg-primary text-background-dark shadow-lg shadow-primary/20 active:scale-95'}`}
          >
            <span className={`material-symbols-outlined text-sm ${celebrating ? 'animate-spin' : ''}`}>
              {item.completed ? 'undo' : 'done_all'}
            </span>
            {item.completed ? 'Mark as Incomplete' : 'Mark Day as Complete'}
          </button>
        </div>
      )}
    </div>
  );
};

export default TripDetails;
