
import React, { useState, useRef, useEffect, useCallback } from 'react';
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
  const [isTyping, setIsTyping] = useState<string | null>(null);
  const [onlineCount, setOnlineCount] = useState(Math.floor(Math.random() * 5) + 3);
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
      } else if (type === 'TYPING_START') {
        setIsTyping(data.name);
      } else if (type === 'TYPING_STOP') {
        setIsTyping(null);
      }
    };

    // Simulate other members joining/leaving
    const interval = setInterval(() => {
      setOnlineCount(prev => Math.max(2, prev + (Math.random() > 0.5 ? 1 : -1)));
    }, 10000);

    return () => {
      channelRef.current?.close();
      clearInterval(interval);
    };
  }, [trip.id]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const triggerAIResponse = async (userText: string) => {
    // Only trigger AI for questions or if destination is mentioned
    const query = userText.toLowerCase();
    const shouldRespond = query.includes('?') || query.includes(trip.destination.split(',')[0].toLowerCase()) || query.includes('weather') || query.includes('recommend');
    
    if (!shouldRespond) return;

    setIsTyping('Tribe Guide (AI)');
    
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
      
      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        senderId: AI_GUIDE.id,
        senderName: AI_GUIDE.name,
        senderAvatar: AI_GUIDE.avatar,
        text: aiText || "I'm here to help! What would you like to know about our upcoming journey?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: false
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("AI Response Error:", error);
    } finally {
      setIsTyping(null);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: 'me',
      senderName: 'Alex Sterling',
      senderAvatar: 'https://picsum.photos/seed/alex/100/100',
      text: inputText,
      timestamp,
      isMe: true
    };

    setMessages([...messages, newMessage]);
    
    // Broadcast to other "participants" (other tabs)
    channelRef.current?.postMessage({ type: 'NEW_MESSAGE', data: newMessage });
    channelRef.current?.postMessage({ type: 'TYPING_STOP' });

    const currentInput = inputText;
    setInputText('');

    // Logic for AI participation
    triggerAIResponse(currentInput);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    if (e.target.value.length > 0) {
      channelRef.current?.postMessage({ type: 'TYPING_START', data: { name: 'Alex' } });
    } else {
      channelRef.current?.postMessage({ type: 'TYPING_STOP' });
    }
  };

  return (
    <div className="flex flex-col h-full bg-background-dark relative">
      {/* Real-time Header */}
      <header className="sticky top-0 z-50 bg-background-dark/80 backdrop-blur-xl border-b border-white/5 px-4 py-3 flex items-center gap-3">
        <button onClick={onBack} className="text-white hover:bg-white/10 p-2 rounded-full transition-colors flex items-center justify-center">
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
            <div key={i} className="relative">
              <img 
                src={`https://picsum.photos/seed/${i + 50}/100/100`} 
                className="w-8 h-8 rounded-full border-2 border-background-dark shadow-sm" 
                alt="Member"
              />
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-primary border-2 border-background-dark rounded-full"></div>
            </div>
          ))}
        </div>
      </header>

      {/* Message Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth hide-scrollbar pb-24"
      >
        <div className="flex flex-col items-center gap-2 py-4">
          <span className="bg-white/5 text-slate-500 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-white/5">
            Encrypted Session Established
          </span>
          <p className="text-[10px] text-slate-600 text-center max-w-[200px]">Only members of this tribe can see messages in this room.</p>
        </div>

        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'} group animate-in fade-in zoom-in-95 duration-300`}>
            <div className={`flex gap-3 max-w-[85%] ${msg.isMe ? 'flex-row-reverse' : 'flex-row'}`}>
              {!msg.isMe && (
                <img src={msg.senderAvatar} className="w-8 h-8 rounded-full shrink-0 self-end mb-1 border border-white/10" alt={msg.senderName} />
              )}
              <div className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}>
                {!msg.isMe && (
                  <span className="text-[10px] font-bold text-slate-500 ml-1 mb-1">{msg.senderName}</span>
                )}
                <div className={`px-4 py-3 rounded-2xl relative shadow-lg ${
                  msg.isMe 
                    ? 'bg-primary text-background-dark rounded-br-none font-medium' 
                    : msg.senderId === AI_GUIDE.id 
                      ? 'bg-blue-600/20 text-blue-100 border border-blue-500/30 rounded-bl-none'
                      : 'bg-white/10 text-white rounded-bl-none border border-white/5'
                }`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  <div className={`flex items-center gap-1 mt-1 justify-end opacity-50 ${msg.isMe ? 'text-background-dark' : 'text-slate-400'}`}>
                    <span className="text-[8px] font-bold">{msg.timestamp}</span>
                    {msg.isMe && <span className="material-symbols-outlined text-[10px] font-bold">done_all</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start animate-in slide-in-from-left-2 duration-300">
            <div className="flex gap-3 items-center">
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                 <span className="material-symbols-outlined text-slate-500 text-sm animate-pulse">edit</span>
              </div>
              <div className="bg-white/5 border border-white/10 px-3 py-2 rounded-2xl rounded-bl-none flex gap-1 items-center">
                <span className="text-[10px] font-bold text-slate-400">{isTyping} is typing</span>
                <div className="flex gap-1 ml-1">
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
          className="bg-white/10 border border-white/10 rounded-2xl p-1.5 flex items-center gap-2 backdrop-blur-xl shadow-2xl ring-1 ring-white/5"
        >
          <div className="flex">
            <button type="button" className="text-slate-400 hover:text-white p-2 rounded-xl transition-all hover:bg-white/5">
              <span className="material-symbols-outlined">attach_file</span>
            </button>
            <button type="button" className="text-slate-400 hover:text-white p-2 rounded-xl transition-all hover:bg-white/5">
              <span className="material-symbols-outlined">image</span>
            </button>
          </div>
          <input 
            type="text" 
            value={inputText}
            onChange={handleInputChange}
            placeholder="Ask the Guide or chat with Tribe..." 
            className="flex-1 bg-transparent border-none focus:ring-0 text-white text-sm py-2 placeholder:text-slate-500"
          />
          <button type="button" className="text-slate-400 hover:text-white p-2 rounded-xl transition-all hover:bg-white/5">
            <span className="material-symbols-outlined">sentiment_satisfied</span>
          </button>
          <button 
            type="submit"
            disabled={!inputText.trim()}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
              inputText.trim() 
                ? 'bg-primary text-background-dark scale-100 shadow-[0_0_20px_rgba(19,236,91,0.4)] active:scale-90' 
                : 'bg-white/5 text-slate-600 scale-95 opacity-50'
            }`}
          >
            <span className="material-symbols-outlined font-bold">send</span>
          </button>
        </form>
        <div className="mt-2 text-center">
           <p className="text-[8px] text-slate-500 font-bold uppercase tracking-[0.2em]">Live Connection Secured via Floc-Net</p>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
