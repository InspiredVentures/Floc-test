
import React, { useState, useRef, useEffect } from 'react';
import { Trip, Message, TripSuggestion } from '../types';
import { GoogleGenAI } from "@google/genai";

interface Props {
  trip: Trip;
  onBack: () => void;
}

const MOCK_MESSAGES: Message[] = [
  {
    id: '1',
    senderId: 'user1',
    senderName: 'Sarah J.',
    senderAvatar: 'https://picsum.photos/seed/sarah/100/100',
    text: "Hey everyone! So excited for our trip! Has everyone sorted their visas?",
    timestamp: '10:30 AM',
    isMe: false
  }
];

const AI_GUIDE = {
  id: 'tribe-guide-ai',
  name: 'Tribe Guide (AI)',
  avatar: 'https://img.icons8.com/fluency/96/artificial-intelligence.png'
};

const ChatRoom: React.FC<Props> = ({ trip, onBack }) => {
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [typingMembers, setTypingMembers] = useState<string[]>([]);
  const [onlineCount, setOnlineCount] = useState(Math.floor(Math.random() * 5) + 3);
  const [pinnedIds, setPinnedIds] = useState<string[]>([]);
  const [showPins, setShowPins] = useState(false);
  const [showSugMenu, setShowSugMenu] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const channelRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    const channelName = `trip-chat-${trip.id}`;
    channelRef.current = new BroadcastChannel(channelName);
    channelRef.current.onmessage = (event) => {
      const { type, data } = event.data;
      if (type === 'NEW_MESSAGE') setMessages((prev) => [...prev, { ...data, isMe: false }]);
    };
    return () => channelRef.current?.close();
  }, [trip.id]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, typingMembers]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: 'me',
      senderName: 'Alex Sterling',
      senderAvatar: 'https://picsum.photos/seed/alex/100/100',
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
      status: 'sent'
    };
    setMessages([...messages, newMessage]);
    setInputText('');
  };

  const handleSuggestTrip = () => {
    // This would ideally open the full modal, for chat we'll send a shortcut card
    const sug: TripSuggestion = {
      id: Date.now().toString(),
      destination: 'Patagonia Expedition',
      budget: 'Mid',
      style: 'Adventure',
      duration: '12 Days',
      ingredients: ['Ice Trekking', 'Wild Camping'],
      travelFrom: 'London, UK',
      suggestedBy: 'Alex Sterling',
      avatar: 'https://picsum.photos/seed/alex/100/100',
      votes: 1,
      myVote: 'up',
      timestamp: 'Just now'
    };
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: 'me',
      senderName: 'Alex Sterling',
      senderAvatar: 'https://picsum.photos/seed/alex/100/100',
      text: "I've pitched a new trip to the Lab! What do you think?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
      suggestion: sug
    };
    setMessages([...messages, newMessage]);
    setShowSugMenu(false);
  };

  return (
    <div className="flex flex-col h-full bg-background-dark relative">
      <header className="sticky top-0 z-50 bg-background-dark/80 backdrop-blur-xl border-b border-white/5 px-4 py-3 flex items-center gap-3">
        <button onClick={onBack} className="text-white hover:bg-white/10 p-2 rounded-full active:scale-90"><span className="material-symbols-outlined">arrow_back</span></button>
        <div className="flex-1 min-w-0">
          <h2 className="text-white font-bold truncate leading-tight">{trip.title}</h2>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{onlineCount} members online</p>
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth hide-scrollbar pb-24">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'} animate-in fade-in zoom-in-95 duration-300`}>
            <div className={`flex gap-3 max-w-[85%] ${msg.isMe ? 'flex-row-reverse' : 'flex-row'}`}>
              <img src={msg.senderAvatar} className="w-8 h-8 rounded-full self-end mb-1" alt="" />
              <div className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}>
                <div className={`px-4 py-3 rounded-2xl relative shadow-xl ${msg.isMe ? 'bg-primary text-background-dark rounded-br-none' : 'bg-white/10 text-white rounded-bl-none border border-white/5'}`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  {msg.suggestion && (
                    <div className="mt-3 bg-black/20 rounded-xl p-3 border border-white/10">
                       <p className="text-[9px] font-black text-primary uppercase tracking-widest mb-1">Trip Pitch</p>
                       <h4 className="text-white font-black text-xs italic">{msg.suggestion.destination}</h4>
                       <div className="flex gap-2 mt-2">
                          <span className="text-[8px] bg-white/5 px-1.5 py-0.5 rounded text-slate-400">{msg.suggestion.budget}</span>
                          <span className="text-[8px] bg-white/5 px-1.5 py-0.5 rounded text-slate-400">{msg.suggestion.duration}</span>
                       </div>
                    </div>
                  )}
                  <div className={`flex items-center gap-1.5 mt-1 justify-end ${msg.isMe ? 'text-background-dark/40' : 'text-slate-500'}`}>
                    <span className="text-[8px] font-black uppercase">{msg.timestamp}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background-dark via-background-dark/95 to-transparent z-50">
        <form onSubmit={handleSendMessage} className="bg-white/10 border border-white/10 rounded-[1.5rem] p-1.5 flex items-center gap-2 backdrop-blur-2xl shadow-2xl relative">
          {showSugMenu && (
            <div className="absolute bottom-full left-0 mb-4 w-48 bg-surface-dark border border-white/10 rounded-2xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-2 duration-300">
               <button type="button" onClick={handleSuggestTrip} className="w-full px-4 py-3 text-left hover:bg-white/5 flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-xl">rocket_launch</span>
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">Suggest Trip</span>
               </button>
            </div>
          )}
          <button type="button" onClick={() => setShowSugMenu(!showSugMenu)} className={`p-2 rounded-xl transition-all ${showSugMenu ? 'bg-primary text-background-dark' : 'text-slate-500'}`}>
            <span className="material-symbols-outlined">add</span>
          </button>
          <input type="text" value={inputText} onChange={e => setInputText(e.target.value)} placeholder="Ask anything..." className="flex-1 bg-transparent border-none focus:ring-0 text-white text-sm" />
          <button type="submit" disabled={!inputText.trim()} className="w-11 h-11 rounded-2xl flex items-center justify-center bg-primary text-background-dark disabled:opacity-50"><span className="material-symbols-outlined font-black">arrow_upward</span></button>
        </form>
      </div>
    </div>
  );
};

export default ChatRoom;
