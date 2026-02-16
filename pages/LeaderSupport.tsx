
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useUser } from '../contexts/UserContext';
import { supabase } from '../lib/supabase';
import { CommunityPost, AppView } from '../types';

interface Props {
  onBack: () => void;
  onOpenResource: (view: AppView) => void;
}

const MOCK_LEADER_POSTS: CommunityPost[] = [
  // ... (unchanged)
  {
    id: 'lp1',
    author: 'Inspired Team',
    authorAvatar: 'https://img.icons8.com/fluency/96/artificial-intelligence.png',
    role: 'Manager',
    content: "Leader Spotlight: Our new Sustainability Tracking Module is now live! Leaders who use the 'Impact Pulse' report saw a 30% increase in member engagement this month. 🌱",
    likes: 45,
    hasLiked: false,
    comments: [],
    time: '2h ago'
  },
  {
    id: 'lp2',
    author: 'Inspired Support',
    authorAvatar: 'https://img.icons8.com/fluency/96/artificial-intelligence.png',
    role: 'Guide',
    content: "Platform Tip: When creating a new venture, use the 'AI Vibe Generator' to automatically craft destination descriptions that resonate with your specific tribe category.",
    likes: 22,
    hasLiked: true,
    comments: [],
    time: '5h ago'
  },
  {
    id: 'lp3',
    author: 'Inspired Ventures',
    authorAvatar: 'https://img.icons8.com/fluency/96/artificial-intelligence.png',
    role: 'Manager',
    content: "Heads up! We're launching exclusive 2025 planning sessions for leaders next week. Keep an eye on your inbox for the invite. 🚀",
    likes: 67,
    hasLiked: false,
    comments: [],
    time: '1d ago'
  }
];

const CONCIERGE_ID = 'inspired-concierge';

const LeaderSupport: React.FC<Props> = ({ onBack, onOpenResource }) => {
  const { messages: globalMessages, sendMessage, addMessage, markAsRead, conversations, setTypingStatus } = useUser();
  const [activeTab, setActiveTab] = useState<'chat' | 'feed'>('chat');
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const conversation = useMemo(() =>
    conversations.find(c => c.participants.includes(CONCIERGE_ID)),
    [conversations]
  );

  const messages = useMemo(() => {
    if (!conversation) return [];
    return globalMessages
      .filter(msg => msg.conversationId === conversation.id)
      .sort((a, b) => a.timestamp - b.timestamp)
      .map(msg => ({
        id: msg.id,
        senderId: msg.senderId,
        senderName: msg.senderName,
        senderAvatar: msg.senderAvatar,
        text: msg.content,
        timestamp: new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: msg.senderId === 'alex-sterling'
      }));
  }, [globalMessages, conversation]);

  const isTyping = conversation?.participantDetails.find(p => p.username === CONCIERGE_ID)?.isTyping;

  useEffect(() => {
    if (conversation && conversation.unreadCount > 0) {
      markAsRead(conversation.id);
    }
  }, [conversation, markAsRead]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping, activeTab]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMessage = inputText.trim();
    // Default to existing conversation or create a new one if not found (handled by sendMessage,
    // but for setTypingStatus/addMessage we prefer a known ID.
    // Since concierge-1 is seeded, conversation?.id should exist.)
    const currentConversationId = conversation?.id;

    if (!currentConversationId) {
      console.warn("Conversation ID not found. Ensuring message sent, but skipping AI response.");
      sendMessage(
        CONCIERGE_ID,
        'Inspired Concierge',
        'https://img.icons8.com/fluency/96/artificial-intelligence.png',
        userMessage,
        undefined
      );
      setInputText('');
      return;
    }

    sendMessage(
      CONCIERGE_ID,
      'Inspired Concierge',
      'https://img.icons8.com/fluency/96/artificial-intelligence.png',
      userMessage,
      currentConversationId
    );
    setInputText('');

    setTypingStatus(currentConversationId, true);

    try {
      const { data, error } = await supabase.functions.invoke('chat-concierge', {
        body: { message: userMessage }
      });

      if (error) throw error;

      if (data && data.reply) {
        addMessage(
          currentConversationId,
          CONCIERGE_ID,
          'Inspired Concierge',
          'https://img.icons8.com/fluency/96/artificial-intelligence.png',
          data.reply
        );
      }
    } catch (err) {
      console.error('Concierge API Error:', err);
      addMessage(
        currentConversationId,
        CONCIERGE_ID,
        'Inspired Concierge',
        'https://img.icons8.com/fluency/96/artificial-intelligence.png',
        "I'm having trouble connecting right now. Please try again later."
      );
    } finally {
      setTypingStatus(currentConversationId, false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background-dark overflow-hidden">
      <header className="px-6 pt-10 pb-6 bg-background-dark/95 backdrop-blur-md border-b border-white/5 flex items-center justify-between z-50">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="text-white size-10 flex items-center justify-center hover:bg-white/5 rounded-2xl transition-all active:scale-90 border border-white/5">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tighter italic leading-none">Concierge</h1>
            <p className="text-primary text-[8px] uppercase tracking-[0.2em] font-black mt-1">Inspired Leader Hub</p>
          </div>
        </div>
        <div className="size-10 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20">
          <span className="material-symbols-outlined text-primary">support_agent</span>
        </div>
      </header>

      <div className="px-6 py-4 bg-background-dark">
        <div className="flex bg-white/5 p-1 rounded-2xl ring-1 ring-white/10">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'chat' ? 'bg-white text-background-dark shadow-xl' : 'text-slate-500'}`}
          >
            <span className="material-symbols-outlined text-sm">chat</span>
            Inspired Concierge
          </button>
          <button
            onClick={() => setActiveTab('feed')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'feed' ? 'bg-white text-background-dark shadow-xl' : 'text-slate-500'}`}
          >
            <span className="material-symbols-outlined text-sm">dynamic_feed</span>
            Leader Pulse
          </button>
        </div>
      </div>

      <main className="flex-1 overflow-y-auto hide-scrollbar relative">
        {activeTab === 'chat' ? (
          <div className="flex flex-col h-full">
            <div ref={scrollRef} className="flex-1 p-6 space-y-6 overflow-y-auto hide-scrollbar pb-32">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                  <div className={`flex gap-3 max-w-[85%] ${msg.isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                    <img src={msg.senderAvatar} className="size-8 rounded-full border border-white/10 shrink-0 self-end mb-1" alt="" />
                    <div className={`p-4 rounded-2xl shadow-xl ${msg.isMe
                      ? 'bg-primary text-background-dark rounded-br-none'
                      : 'bg-surface-dark text-white border border-white/5 rounded-bl-none'
                      }`}>
                      <p className="text-xs leading-relaxed">{msg.text}</p>
                      <span className={`text-[8px] font-black uppercase tracking-widest mt-2 block text-right ${msg.isMe ? 'text-background-dark/40' : 'text-slate-500'}`}>
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex gap-3 items-center">
                    <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary text-xs animate-pulse">support_agent</span>
                    </div>
                    <div className="bg-surface-dark border border-white/5 px-4 py-2 rounded-2xl rounded-bl-none">
                      <div className="flex gap-1">
                        <div className="w-1 h-1 bg-primary rounded-full animate-bounce"></div>
                        <div className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background-dark via-background-dark to-transparent">
              <form onSubmit={handleSendMessage} className="relative group">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ask Inspired Concierge..."
                  className="w-full bg-surface-dark border border-white/10 rounded-2xl py-4 pl-6 pr-14 text-sm text-white focus:border-primary outline-none transition-all shadow-2xl"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 size-10 bg-primary rounded-xl flex items-center justify-center text-background-dark shadow-lg active:scale-90 transition-all disabled:opacity-50"
                >
                  <span className="material-symbols-outlined font-black">send</span>
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 pb-32">
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-white text-lg font-black tracking-tight italic">Global Updates</h3>
                <span className="text-primary text-[8px] font-black uppercase tracking-[0.2em] bg-primary/10 px-2 py-0.5 rounded">Leader Access Only</span>
              </div>
              <div className="space-y-6">
                {MOCK_LEADER_POSTS.map(post => (
                  <div key={post.id} className="bg-surface-dark border border-white/5 rounded-3xl p-5 shadow-xl group hover:border-primary/20 transition-all">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="size-10 rounded-2xl bg-white/5 flex items-center justify-center overflow-hidden border border-white/10">
                        <img src={post.authorAvatar} alt="" />
                      </div>
                      <div>
                        <h4 className="text-white font-black text-xs uppercase tracking-widest leading-none">{post.author}</h4>
                        <p className="text-slate-500 text-[9px] font-bold mt-1">{post.time}</p>
                      </div>
                    </div>
                    <p className="text-slate-300 text-xs leading-relaxed mb-4">{post.content}</p>
                    <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                      <button className="flex items-center gap-1.5 text-slate-500 hover:text-primary transition-colors">
                        <span className={`material-symbols-outlined text-sm ${post.hasLiked ? 'fill-1 text-primary' : ''}`}>favorite</span>
                        <span className="text-[10px] font-black">{post.likes}</span>
                      </button>
                      <button className="flex items-center gap-1.5 text-slate-500 hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-sm">forum</span>
                        <span className="text-[10px] font-black">Discuss</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-white text-lg font-black tracking-tight italic px-1">Resource Vault</h3>
              <div className="grid grid-cols-2 gap-4">
                <ResourceItem icon="description" title="Impact Guide" onClick={() => onOpenResource(AppView.IMPACT_GUIDE)} />
                <ResourceItem icon="gavel" title="Protocol PDF" onClick={() => onOpenResource(AppView.PROTOCOL_VIEWER)} />
                <ResourceItem icon="savings" title="Billing Center" onClick={() => onOpenResource(AppView.BILLING_CENTER)} />
                <ResourceItem icon="insights" title="Analytics API" onClick={() => onOpenResource(AppView.ANALYTICS_API)} />
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
};

const ResourceItem: React.FC<{ icon: string, title: string, onClick: () => void }> = ({ icon, title, onClick }) => (
  <button onClick={onClick} className="flex flex-col items-center gap-3 bg-white/5 border border-white/10 p-5 rounded-3xl hover:bg-white/10 transition-all group active:scale-95">
    <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
      <span className="material-symbols-outlined">{icon}</span>
    </div>
    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white transition-colors">{title}</span>
  </button>
);

export default LeaderSupport;
