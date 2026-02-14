import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useUser } from '../contexts/UserContext';
import { Message, TripSuggestion } from '../types';

interface Props {
  id: string; // This could be communityId or tripId
  title: string;
  subtitle: string;
  onBack: () => void;
  type?: 'community' | 'trip';
}

const ChatRoom: React.FC<Props> = ({ id, title, subtitle, onBack, type = 'community' }) => {
  const { messages, sendMessage, markAsRead, conversations, setTypingStatus } = useUser();
  const [inputText, setInputText] = useState('');
  const [showSugMenu, setShowSugMenu] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  const conversationId = id; // For group chats, we use the community/trip id as conversationId

  const convoMessages = useMemo(() =>
    messages.filter(msg => msg.conversationId === conversationId).sort((a, b) => a.timestamp - b.timestamp)
    , [messages, conversationId]);

  const conversation = conversations.find(c => c.id === conversationId);

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
    sendMessage(id, title, '', inputText, conversationId, 'group');
    setInputText('');
  };

  const handleSuggestTrip = () => {
    const content = "I've pitched a new trip to the Lab! What do you think?";
    // sendMessage handles the basic message. For suggestions, we might need a separate call or enhanced sendMessage
    // For now, let's just send the text
    sendMessage(id, title, '', content, conversationId, 'group');
    setShowSugMenu(false);
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full bg-background-dark relative">
      <header className="sticky top-0 z-50 bg-background-dark/80 backdrop-blur-xl border-b border-white/5 px-4 py-3 flex items-center gap-3">
        <button onClick={onBack} className="text-white hover:bg-white/10 p-2 rounded-full active:scale-90 flex items-center justify-center">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div className="flex-1 min-w-0">
          <h2 className="text-white font-black truncate leading-tight tracking-tight">{title}</h2>
          <div className="flex items-center gap-2">
            <span className="size-1.5 bg-primary rounded-full animate-pulse shadow-sm shadow-primary/20"></span>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{subtitle}</p>
          </div>
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth hide-scrollbar pb-24">
        {convoMessages.length > 0 ? convoMessages.map((msg) => {
          const isMe = msg.senderId === 'alex-sterling';
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
              <div className={`flex gap-3 max-w-[85%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                <img src={msg.senderAvatar} className="w-8 h-8 rounded-xl self-end mb-1 border border-white/10 shadow-sm" alt="" />
                <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  {!isMe && <span className="text-[10px] font-black text-slate-500 mb-1 ml-1 uppercase tracking-tighter">{msg.senderName}</span>}
                  <div className={`px-4 py-3 rounded-2xl relative shadow-xl ${isMe ? 'bg-primary text-background-dark font-medium rounded-br-none' : 'bg-white/5 text-white rounded-bl-none border border-white/10'}`}>
                    <p className="text-[13px] leading-relaxed whitespace-pre-wrap">{msg.content}</p>
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
                    <div className={`flex items-center gap-1.5 mt-1.5 justify-end ${isMe ? 'text-background-dark/30' : 'text-slate-600'}`}>
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
          <div className="h-full flex flex-col items-center justify-center opacity-30">
            <div className="size-20 bg-white/5 rounded-[2rem] border border-white/10 flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-4xl text-slate-500">forum</span>
            </div>
            <h3 className="text-white font-black text-xl mb-2">Community Gathering</h3>
            <p className="text-slate-500 text-sm">Start the conversation with your community.</p>
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background-dark via-background-dark/95 to-transparent z-50">
        <form onSubmit={handleSendMessage} className="bg-white/5 border border-white/10 rounded-[1.5rem] p-1.5 flex items-center gap-2 backdrop-blur-2xl shadow-2xl relative group focus-within:border-primary/30 transition-all">
          {showSugMenu && (
            <div className="absolute bottom-full left-0 mb-4 w-56 bg-surface-dark border border-white/10 rounded-[1.5rem] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-2 duration-300 backdrop-blur-xl">
              <button type="button" onClick={handleSuggestTrip} className="w-full px-5 py-4 text-left hover:bg-white/5 flex items-center gap-4 transition-all group/item">
                <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover/item:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-primary text-xl">rocket_launch</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-black text-white uppercase tracking-wider">Suggest Trip</span>
                  <span className="text-[9px] text-slate-500 font-bold">Pitch to the Lab</span>
                </div>
              </button>
            </div>
          )}
          <button type="button" onClick={() => setShowSugMenu(!showSugMenu)} className={`size-11 flex items-center justify-center rounded-[1rem] transition-all hover:scale-110 active:scale-90 ${showSugMenu ? 'bg-primary text-background-dark shadow-lg shadow-primary/20' : 'text-slate-500 hover:text-white'}`}>
            <span className="material-symbols-outlined font-black">add</span>
          </button>
          <input
            type="text"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder="Inspire your tribe..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-white text-sm placeholder:text-slate-600 font-medium px-2"
          />
          <button type="submit" disabled={!inputText.trim()} className={`size-11 flex items-center justify-center rounded-[1rem] transition-all ${inputText.trim() ? 'bg-primary text-background-dark hover:scale-110 active:scale-95 shadow-xl shadow-primary/20' : 'bg-white/5 text-slate-700 disabled:opacity-50 cursor-not-allowed'}`}>
            <span className="material-symbols-outlined font-black">arrow_upward</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatRoom;
