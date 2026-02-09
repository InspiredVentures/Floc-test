
import React, { useState, useRef, useEffect } from 'react';
import { Trip, Message } from '../types';
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
  },
  {
    id: '2',
    senderId: 'user2',
    senderName: 'Mike Ross',
    senderAvatar: 'https://picsum.photos/seed/mike/100/100',
    text: "Just applied for mine yesterday. The process was pretty straightforward online.",
    timestamp: '10:45 AM',
    isMe: false
  }
];

// Tribe Guide identities
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
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const channelRef = useRef<BroadcastChannel | null>(null);

  // Initialize "WebSocket" (Simulated via BroadcastChannel)
  useEffect(() => {
    const channelName = `trip-chat-${trip.id}`;
    channelRef.current = new BroadcastChannel(channelName);

    channelRef.current.onmessage = (event) => {
      const { type, data } = event.data;
      
      if (type === 'NEW_MESSAGE') {
        setMessages((prev) => [...prev, { ...data, isMe: false }]);
        channelRef.current?.postMessage({ 
          type: 'MESSAGE_STATUS_UPDATE', 
          data: { id: data.id, status: 'delivered' } 
        });
        setTimeout(() => {
          channelRef.current?.postMessage({ 
            type: 'MESSAGE_STATUS_UPDATE', 
            data: { id: data.id, status: 'read' } 
          });
        }, 2000);
      } else if (type === 'MESSAGE_STATUS_UPDATE') {
        setMessages(prev => prev.map(m => 
          m.id === data.id ? { ...m, status: data.status } : m
        ));
      } else if (type === 'TYPING_START') {
        setTypingMembers(prev => prev.includes(data.name) ? prev : [...prev, data.name]);
      } else if (type === 'TYPING_STOP') {
        setTypingMembers(prev => prev.filter(name => name !== data.name));
      } else if (type === 'PIN_UPDATE') {
        setPinnedIds(data.pinnedIds);
      }
    };

    const typingInterval = setInterval(() => {
      if (Math.random() > 0.8 && typingMembers.length < 2) {
        const name = ['Sarah', 'Mike', 'Elena'][Math.floor(Math.random() * 3)];
        setTypingMembers(prev => prev.includes(name) ? prev : [...prev, name]);
        setTimeout(() => {
          setTypingMembers(prev => prev.filter(n => name !== n));
        }, 3000);
      }
    }, 6000);

    return () => {
      channelRef.current?.close();
      clearInterval(typingInterval);
    };
  }, [trip.id, typingMembers]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typingMembers]);

  const togglePin = (id: string) => {
    setPinnedIds(prev => {
      const newPins = prev.includes(id) ? prev.filter(pid => pid !== id) : [id, ...prev];
      channelRef.current?.postMessage({ type: 'PIN_UPDATE', data: { pinnedIds: newPins } });
      return newPins;
    });
  };

  const triggerAIResponse = async (userText: string) => {
    const query = userText.toLowerCase();
    const shouldRespond = query.includes('?') || 
                          query.includes(trip.destination.split(',')[0].toLowerCase()) || 
                          query.includes('weather') || 
                          query.includes('recommend') ||
                          query.includes('guide');
    
    if (!shouldRespond) return;

    setTypingMembers(prev => [...prev, 'Tribe Guide (AI)']);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `You are the Tribe Guide for a Floc travel group. The trip is "${trip.title}" to ${trip.destination}. A traveler asked: "${userText}". Provide a helpful, concise response. Use Google Search if needed for current info like weather or local events. Keep the tone friendly and professional.`,
        config: {
          tools: [{ googleSearch: {} }]
        }
      });

      const aiText = response.text;
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      const sources = groundingChunks?.map((chunk: any) => ({
        title: chunk.web?.title || 'Source',
        uri: chunk.web?.uri
      })).filter((s: any) => s.uri);
      
      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        senderId: AI_GUIDE.id,
        senderName: AI_GUIDE.name,
        senderAvatar: AI_GUIDE.avatar,
        text: aiText || "I'm here to help! What would you like to know about our upcoming journey?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: false,
        sources: sources && sources.length > 0 ? sources : undefined
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("AI Response Error:", error);
    } finally {
      setTypingMembers(prev => prev.filter(n => n !== 'Tribe Guide (AI)'));
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const messageId = Date.now().toString();
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMessage: Message = {
      id: messageId,
      senderId: 'me',
      senderName: 'Alex Sterling',
      senderAvatar: 'https://picsum.photos/seed/alex/100/100',
      text: inputText,
      timestamp,
      isMe: true,
      status: 'sent'
    };

    setMessages([...messages, newMessage]);
    channelRef.current?.postMessage({ type: 'NEW_MESSAGE', data: newMessage });
    channelRef.current?.postMessage({ type: 'TYPING_STOP', data: { name: 'Alex' } });

    setTimeout(() => {
      setMessages(prev => prev.map(m => m.id === messageId && m.status === 'sent' ? { ...m, status: 'delivered' } : m));
    }, 1500);
    setTimeout(() => {
      setMessages(prev => prev.map(m => m.id === messageId && m.status === 'delivered' ? { ...m, status: 'read' } : m));
    }, 4000);

    const currentInput = inputText;
    setInputText('');
    triggerAIResponse(currentInput);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    if (e.target.value.length > 0) {
      channelRef.current?.postMessage({ type: 'TYPING_START', data: { name: 'Alex' } });
    } else {
      channelRef.current?.postMessage({ type: 'TYPING_STOP', data: { name: 'Alex' } });
    }
  };

  const renderStatusIcon = (status?: 'sent' | 'delivered' | 'read') => {
    if (!status) return null;
    switch (status) {
      case 'sent': return <span className="material-symbols-outlined text-[12px] font-bold text-background-dark/30">done</span>;
      case 'delivered': return <span className="material-symbols-outlined text-[12px] font-bold text-background-dark/50">done_all</span>;
      case 'read': return <span className="material-symbols-outlined text-[12px] font-black text-background-dark scale-110">done_all</span>;
      default: return null;
    }
  };

  const pinnedMessages = messages.filter(m => pinnedIds.includes(m.id));

  return (
    <div className="flex flex-col h-full bg-background-dark relative">
      {/* Real-time Header */}
      <header className="sticky top-0 z-50 bg-background-dark/80 backdrop-blur-xl border-b border-white/5 px-4 py-3 flex items-center gap-3">
        <button onClick={onBack} className="text-white hover:bg-white/10 p-2 rounded-full transition-colors flex items-center justify-center active:scale-90">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-white font-bold truncate leading-tight">{trip.title} Tribe</h2>
            <div className="bg-primary/20 px-1.5 py-0.5 rounded flex items-center gap-1">
               <span className="w-1 h-1 rounded-full bg-primary animate-pulse"></span>
               <span className="text-[8px] font-black text-primary uppercase tracking-tighter">Live</span>
            </div>
          </div>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 mt-0.5">
            {onlineCount} members online
          </p>
        </div>
        <div className="flex -space-x-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="relative group">
              <img 
                src={`https://picsum.photos/seed/${i + 50}/100/100`} 
                className="w-8 h-8 rounded-full border-2 border-background-dark shadow-sm group-hover:scale-110 transition-transform" 
                alt="Member"
              />
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-background-dark rounded-full"></div>
            </div>
          ))}
        </div>
      </header>

      {/* Pinned Messages Summary Bar */}
      {pinnedMessages.length > 0 && (
        <div className="sticky top-[64px] z-40 bg-primary/5 backdrop-blur-md border-b border-primary/10 px-4 py-2 flex items-center justify-between group cursor-pointer transition-all hover:bg-primary/10" onClick={() => setShowPins(!showPins)}>
          <div className="flex items-center gap-2 overflow-hidden">
             <span className={`material-symbols-outlined text-primary text-sm ${showPins ? 'rotate-180' : ''} transition-transform`}>push_pin</span>
             <p className="text-white text-[10px] font-black uppercase tracking-widest truncate">
               {showPins ? 'All Pinned Items' : pinnedMessages[0].text}
             </p>
          </div>
          <div className="flex items-center gap-2">
             <span className="text-[9px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-full">{pinnedMessages.length}</span>
             <span className="material-symbols-outlined text-slate-600 text-sm">chevron_right</span>
          </div>
        </div>
      )}

      {/* Pinned Items Drawer */}
      {showPins && pinnedMessages.length > 0 && (
        <div className="absolute top-[100px] left-4 right-4 z-[60] bg-surface-dark/95 backdrop-blur-2xl border border-white/10 rounded-3xl p-5 shadow-2xl animate-in slide-in-from-top-4 duration-300">
           <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-black text-xs uppercase tracking-widest">Important Notes</h3>
              <button onClick={() => setShowPins(false)} className="text-slate-500 hover:text-white">
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
           </div>
           <div className="space-y-3 max-h-[300px] overflow-y-auto hide-scrollbar">
              {pinnedMessages.map(msg => (
                <div key={msg.id} className="bg-white/5 border border-white/5 p-3 rounded-2xl flex gap-3 relative group">
                   <img src={msg.senderAvatar} className="size-8 rounded-full" alt="" />
                   <div className="flex-1">
                      <p className="text-slate-300 text-xs leading-relaxed">{msg.text}</p>
                      <p className="text-slate-500 text-[8px] font-black uppercase mt-1.5">{msg.senderName} • {msg.timestamp}</p>
                   </div>
                   <button onClick={() => togglePin(msg.id)} className="text-primary hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-sm fill-1">push_pin</span>
                   </button>
                </div>
              ))}
           </div>
        </div>
      )}

      {/* Message Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth hide-scrollbar pb-24"
      >
        <div className="flex flex-col items-center gap-2 py-4">
          <span className="bg-white/5 text-slate-500 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-white/5">
            End-to-End Encrypted
          </span>
          <p className="text-[10px] text-slate-600 text-center max-w-[200px]">Pulse connection active. All messages are private to this Tribe.</p>
        </div>

        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'} group animate-in fade-in zoom-in-95 duration-300 relative`}>
            <div className={`flex gap-3 max-w-[85%] ${msg.isMe ? 'flex-row-reverse' : 'flex-row'}`}>
              {!msg.isMe && (
                <img src={msg.senderAvatar} className="w-8 h-8 rounded-full shrink-0 self-end mb-1 border border-white/10 shadow-md" alt={msg.senderName} />
              )}
              <div className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}>
                {!msg.isMe && (
                  <span className="text-[10px] font-black text-slate-500 ml-1 mb-1 uppercase tracking-widest">{msg.senderName}</span>
                )}
                <div className={`px-4 py-3 rounded-2xl relative shadow-xl transition-all group/bubble ${
                  msg.isMe 
                    ? 'bg-primary text-background-dark rounded-br-none font-medium' 
                    : msg.senderId === AI_GUIDE.id 
                      ? 'bg-blue-600/20 text-blue-100 border border-blue-500/30 rounded-bl-none'
                      : 'bg-white/10 text-white rounded-bl-none border border-white/5'
                }`}>
                  {pinnedIds.includes(msg.id) && (
                    <div className="absolute -top-1.5 -left-1.5 size-4 bg-primary text-background-dark rounded-full flex items-center justify-center border border-background-dark">
                      <span className="material-symbols-outlined text-[10px] font-black fill-1">push_pin</span>
                    </div>
                  )}

                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-blue-500/20 space-y-1">
                      <p className="text-[8px] font-black uppercase tracking-widest text-blue-400 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[10px]">search</span>
                        AI Grounding:
                      </p>
                      {msg.sources.map((source, idx) => (
                        <a 
                          key={idx} 
                          href={source.uri} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[9px] text-blue-300 hover:text-white transition-colors block truncate max-w-[180px]"
                        >
                          • {source.title}
                        </a>
                      ))}
                    </div>
                  )}

                  <div className={`flex items-center gap-1.5 mt-1 justify-end ${msg.isMe ? 'text-background-dark/40' : 'text-slate-500'}`}>
                    <span className="text-[8px] font-black uppercase tracking-tighter">{msg.timestamp}</span>
                    {msg.isMe && renderStatusIcon(msg.status)}
                  </div>

                  {/* Pin Toggle Button - Shows on group hover or click */}
                  <button 
                    onClick={() => togglePin(msg.id)}
                    className={`absolute ${msg.isMe ? '-left-8' : '-right-8'} top-1/2 -translate-y-1/2 size-6 rounded-full bg-white/5 border border-white/10 text-slate-500 opacity-0 group-hover/bubble:opacity-100 transition-all flex items-center justify-center hover:bg-white/10 hover:text-primary ${pinnedIds.includes(msg.id) ? 'text-primary opacity-100' : ''}`}
                  >
                    <span className={`material-symbols-outlined text-xs ${pinnedIds.includes(msg.id) ? 'fill-1' : ''}`}>push_pin</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Typing Indicators */}
        {typingMembers.length > 0 && (
          <div className="flex justify-start animate-in slide-in-from-left-2 duration-300">
            <div className="flex gap-3 items-center">
              <div className="size-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                 <span className="material-symbols-outlined text-slate-500 text-sm animate-pulse">edit</span>
              </div>
              <div className="bg-white/5 border border-white/10 px-3 py-2 rounded-2xl rounded-bl-none flex gap-2 items-center shadow-lg">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {typingMembers.length > 1 
                    ? `${typingMembers[0]} + ${typingMembers.length - 1} others`
                    : typingMembers[0]}
                </span>
                <div className="flex gap-1 items-center">
                  <div className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-1 h-1 bg-primary rounded-full animate-bounce"></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background-dark via-background-dark/95 to-transparent z-50">
        <form 
          onSubmit={handleSendMessage}
          className="bg-white/10 border border-white/10 rounded-[1.5rem] p-1.5 flex items-center gap-2 backdrop-blur-2xl shadow-2xl ring-1 ring-white/5"
        >
          <div className="flex">
            <button type="button" className="text-slate-500 hover:text-white p-2 rounded-xl transition-all hover:bg-white/5">
              <span className="material-symbols-outlined text-[20px]">add</span>
            </button>
          </div>
          <input 
            type="text" 
            value={inputText}
            onChange={handleInputChange}
            placeholder="Ask anything or chat with Tribe..." 
            className="flex-1 bg-transparent border-none focus:ring-0 text-white text-sm py-2 placeholder:text-slate-600 font-medium"
          />
          <button 
            type="submit"
            disabled={!inputText.trim()}
            className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-500 ${
              inputText.trim() 
                ? 'bg-primary text-background-dark scale-100 shadow-[0_0_20px_rgba(255,107,53,0.5)] active:scale-90' 
                : 'bg-white/5 text-slate-700 scale-95 opacity-50'
            }`}
          >
            <span className="material-symbols-outlined font-black">arrow_upward</span>
          </button>
        </form>
        <div className="mt-2 text-center">
           <p className="text-[7px] text-slate-700 font-black uppercase tracking-[0.3em]">Encrypted Discovery Protocol v4.2</p>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
