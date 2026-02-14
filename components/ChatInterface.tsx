import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useUser } from '../contexts/UserContext';
import { Message } from '../types';

interface Props {
    id: string; // This could be communityId or tripId
    title?: string;
    subtitle?: string;
    type?: 'community' | 'trip';
    embedded?: boolean;
}

export const ChatInterface: React.FC<Props> = ({ id, title, subtitle, type = 'community', embedded = false }) => {
    const { messages, sendMessage, markAsRead, conversations } = useUser();
    const [inputText, setInputText] = useState('');
    const [showSugMenu, setShowSugMenu] = useState(false);

    const scrollRef = useRef<HTMLDivElement>(null);

    const conversationId = id; // For group chats, we use the community/trip id as conversationId

    const convoMessages = useMemo(() =>
        messages.filter(msg => msg.conversationId === conversationId).sort((a, b) => a.timestamp - b.timestamp)
        , [messages, conversationId]);

    useEffect(() => {
        markAsRead(conversationId);
    }, [conversationId, markAsRead, convoMessages.length]);

    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [convoMessages]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        // In group chat, recipientId is not used, so we pass community/trip ID as first arg and 'group' as type
        sendMessage(id, title || 'Chat', '', inputText, conversationId, 'group');
        setInputText('');
    };

    const handleSuggestTrip = () => {
        const content = "I've pitched a new trip to the Lab! What do you think?";
        sendMessage(id, title || 'Chat', '', content, conversationId, 'group');
        setShowSugMenu(false);
    };

    const formatTime = (timestamp: number) => {
        return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className={`flex flex-col h-full bg-transparent relative ${embedded ? 'min-h-[600px]' : ''}`}>

            {!embedded && (
                <header className="sticky top-0 z-50 bg-background-dark/80 backdrop-blur-xl border-b border-white/5 px-4 py-3 flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                        <h2 className="text-white font-black truncate leading-tight tracking-tight">{title}</h2>
                        <div className="flex items-center gap-2">
                            <span className="size-1.5 bg-primary rounded-full animate-pulse shadow-sm shadow-primary/20"></span>
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{subtitle}</p>
                        </div>
                    </div>
                </header>
            )}

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth hide-scrollbar pb-24">
                {convoMessages.length > 0 ? convoMessages.map((msg) => {
                    const isMe = msg.senderId === 'alex-sterling';
                    return (
                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                            <div className={`flex gap-3 max-w-[85%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                                <img src={msg.senderAvatar} className="w-8 h-8 rounded-xl self-end mb-1 border border-primary/10 shadow-sm" alt="" />
                                <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                    {!isMe && <span className="text-[10px] font-black text-primary/60 mb-1 ml-1 uppercase tracking-tighter">{msg.senderName}</span>}
                                    <div className={`px-4 py-3 rounded-2xl relative shadow-sm ${isMe ? 'bg-primary text-white font-medium rounded-br-none shadow-primary/20' : 'bg-white text-[#14532D] rounded-bl-none border border-primary/5'}`}>
                                        <p className="text-[13px] leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                                        {msg.suggestion && (
                                            <div className="mt-3 bg-black/5 rounded-xl p-3 border border-black/5">
                                                <p className="text-[9px] font-black text-primary uppercase tracking-widest mb-1">Trip Pitch</p>
                                                <h4 className="text-primary font-black text-xs italic">{msg.suggestion.destination}</h4>
                                                <div className="flex gap-2 mt-2">
                                                    <span className="text-[8px] bg-white/50 px-1.5 py-0.5 rounded text-primary/60">{msg.suggestion.budget}</span>
                                                    <span className="text-[8px] bg-white/50 px-1.5 py-0.5 rounded text-primary/60">{msg.suggestion.duration}</span>
                                                </div>
                                            </div>
                                        )}
                                        <div className={`flex items-center gap-1.5 mt-1.5 justify-end ${isMe ? 'text-white/40' : 'text-primary/30'}`}>
                                            <span className="text-[9px] font-black uppercase tracking-tighter">{formatTime(msg.timestamp)}</span>
                                            {isMe && (
                                                <span className="material-symbols-outlined text-[12px] font-black">
                                                    {msg.read ? 'done_all' : 'double_check'}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                }) : (
                    <div className="h-full flex flex-col items-center justify-center opacity-30 min-h-[400px]">
                        <div className="size-20 bg-primary/5 rounded-[2rem] border border-primary/10 flex items-center justify-center mb-6">
                            <span className="material-symbols-outlined text-4xl text-primary">forum</span>
                        </div>
                        <h3 className="text-primary font-black text-xl mb-2">Team Comms</h3>
                        <p className="text-primary/50 text-sm">Start the conversation with your squad.</p>
                    </div>
                )}
            </div>

            <div className={`absolute bottom-0 left-0 right-0 p-4 z-50 ${embedded ? '' : 'bg-gradient-to-t from-background-dark via-background-dark/95 to-transparent'}`}>
                <form onSubmit={handleSendMessage} className="bg-white/80 border border-primary/10 rounded-[1.5rem] p-1.5 flex items-center gap-2 backdrop-blur-2xl shadow-xl relative group focus-within:border-primary/30 transition-all">
                    {showSugMenu && (
                        <div className="absolute bottom-full left-0 mb-4 w-56 bg-white border border-primary/10 rounded-[1.5rem] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-2 duration-300">
                            <button type="button" onClick={handleSuggestTrip} className="w-full px-5 py-4 text-left hover:bg-primary/5 flex items-center gap-4 transition-all group/item">
                                <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover/item:scale-110 transition-transform">
                                    <span className="material-symbols-outlined text-primary text-xl">rocket_launch</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[11px] font-black text-primary uppercase tracking-wider">Suggest Trip</span>
                                    <span className="text-[9px] text-primary/50 font-bold">Pitch to the Lab</span>
                                </div>
                            </button>
                        </div>
                    )}
                    <button type="button" onClick={() => setShowSugMenu(!showSugMenu)} className={`size-11 flex items-center justify-center rounded-[1rem] transition-all hover:scale-110 active:scale-90 ${showSugMenu ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-primary/40 hover:text-primary'}`}>
                        <span className="material-symbols-outlined font-black">add</span>
                    </button>
                    <input
                        type="text"
                        value={inputText}
                        onChange={e => setInputText(e.target.value)}
                        placeholder="Message the team..."
                        className="flex-1 bg-transparent border-none focus:ring-0 text-primary text-sm placeholder:text-primary/40 font-medium px-2"
                    />
                    <button type="submit" disabled={!inputText.trim()} className={`size-11 flex items-center justify-center rounded-[1rem] transition-all ${inputText.trim() ? 'bg-primary text-white hover:scale-110 active:scale-95 shadow-xl shadow-primary/20' : 'bg-primary/5 text-primary/30 disabled:opacity-50 cursor-not-allowed'}`}>
                        <span className="material-symbols-outlined font-black">arrow_upward</span>
                    </button>
                </form>
            </div>
        </div>
    );
};
