import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { User } from '../types';

// Local Mock users for thread context
const MOCK_USERS: Record<string, Partial<User>> = {
    'elena-vance': {
        username: 'elena-vance',
        displayName: 'Elena Vance',
        avatar: 'https://picsum.photos/seed/elena/400/400'
    },
    'alex-sterling': {
        username: 'alex-sterling',
        displayName: 'Alex Sterling',
        avatar: 'https://picsum.photos/seed/alex/400/400'
    },
    'sarah-jenkins': {
        username: 'sarah-jenkins',
        displayName: 'Sarah Jenkins',
        avatar: 'https://picsum.photos/seed/sarah/400/400'
    }
};

const MessageThread: React.FC = () => {
    const { username } = useParams<{ username: string }>();
    const navigate = useNavigate();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { messages, sendMessage, markAsRead, conversations, setTypingStatus } = useUser();
    const [inputText, setInputText] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const otherUser = username ? MOCK_USERS[username] : null;

    const conversation = useMemo(() =>
        conversations.find(c => c.participants.includes(username || '')),
        [conversations, username]
    );

    const otherParticipant = conversation?.participantDetails.find(p => p.username === username);

    const conversationMessages = conversation
        ? messages.filter(msg => msg.conversationId === conversation.id).sort((a, b) => a.timestamp - b.timestamp)
        : [];

    // Mark as read and simulate typing status
    useEffect(() => {
        if (conversation) {
            markAsRead(conversation.id);

            // Simulate other person typing when you enter the chat
            const timer = setTimeout(() => {
                setTypingStatus(conversation.id, true);
                setTimeout(() => setTypingStatus(conversation.id, false), 3000);
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, [conversation?.id, markAsRead, setTypingStatus]);

    // Auto scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [conversationMessages.length]);

    const handleSend = () => {
        if (!inputText.trim() || !otherUser) return;

        sendMessage(otherUser.username!, otherUser.displayName!, otherUser.avatar!, inputText.trim());
        setInputText('');
    };

    const formatTime = (timestamp: number) => {
        return new Date(timestamp).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    const getStatusIcon = (status?: 'sent' | 'delivered' | 'read') => {
        switch (status) {
            case 'read': return <span className="material-symbols-outlined text-[12px] text-primary font-black">done_all</span>;
            case 'delivered': return <span className="material-symbols-outlined text-[12px] text-slate-500 font-black">done_all</span>;
            case 'sent': return <span className="material-symbols-outlined text-[12px] text-slate-500 font-black">check</span>;
            default: return null;
        }
    };

    if (!otherUser) {
        return (
            <div className="min-h-screen bg-background-dark flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-white font-black text-2xl mb-2 tracking-tight">User Not Found</h2>
                    <p className="text-slate-400 text-sm mb-6 leading-relaxed">Could not find a tribe member with that identity.</p>
                    <button
                        onClick={() => navigate('/messages')}
                        className="px-8 py-4 bg-primary text-background-dark rounded-2xl font-black text-[10px] uppercase tracking-widest"
                    >
                        Back to Inbox
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background-dark flex flex-col">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-background-dark/95 backdrop-blur-md border-b border-white/5">
                <div className="px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                        <button
                            onClick={() => navigate('/messages')}
                            className="size-10 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all shrink-0"
                        >
                            <span className="material-symbols-outlined text-white text-[20px]">arrow_back</span>
                        </button>

                        <div
                            className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
                            onClick={() => navigate(`/profile/${otherUser.username}`)}
                        >
                            <div className="relative">
                                <img
                                    src={otherUser.avatar}
                                    alt={otherUser.displayName}
                                    className="size-11 rounded-2xl border border-white/10 shadow-inner"
                                />
                                {otherParticipant?.isOnline && (
                                    <div className="absolute -bottom-1 -right-1 size-3 bg-accent border-2 border-background-dark rounded-full shadow-lg shadow-accent/20"></div>
                                )}
                            </div>
                            <div className="min-w-0">
                                <h1 className="text-white font-black text-sm tracking-tight truncate">{otherUser.displayName}</h1>
                                <div className="flex items-center gap-1.5">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-primary leading-none">
                                        {otherParticipant?.isTyping ? (
                                            <span className="flex items-center gap-1">typing<span className="animate-pulse">...</span></span>
                                        ) : otherParticipant?.isOnline ? 'Active Now' : 'Offline'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative group">
                        <button
                            className={`size-10 flex items-center justify-center rounded-2xl border transition-all shrink-0 active:scale-95 ${isMenuOpen ? 'bg-primary text-background-dark border-primary' : 'bg-white/5 border-white/10 hover:bg-white/10 text-white'}`}
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            <span className="material-symbols-outlined text-[20px]">more_vert</span>
                        </button>

                        {isMenuOpen && (
                            <div className="absolute top-full right-0 mt-2 w-48 bg-background-dark border border-white/10 rounded-2xl shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                                <button className="w-full text-left px-4 py-3 text-xs font-bold text-white hover:bg-white/5 flex items-center gap-2 transition-colors" onClick={() => { navigate(`/profile/${otherUser.username}`); setIsMenuOpen(false); }}>
                                    <span className="material-symbols-outlined text-sm">person</span>
                                    View Profile
                                </button>
                                <button className="w-full text-left px-4 py-3 text-xs font-bold text-white hover:bg-white/5 flex items-center gap-2 transition-colors" onClick={() => setIsMenuOpen(false)}>
                                    <span className="material-symbols-outlined text-sm">notifications_off</span>
                                    Mute Notifications
                                </button>
                                <button className="w-full text-left px-4 py-3 text-xs font-bold text-slate-400 hover:bg-white/5 hover:text-white flex items-center gap-2 transition-colors border-t border-white/5" onClick={() => setIsMenuOpen(false)}>
                                    <span className="material-symbols-outlined text-sm">flag</span>
                                    Report
                                </button>
                                <button className="w-full text-left px-4 py-3 text-xs font-bold text-red-400 hover:bg-red-500/10 flex items-center gap-2 transition-colors" onClick={() => setIsMenuOpen(false)}>
                                    <span className="material-symbols-outlined text-sm">block</span>
                                    Block User
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-6 scroll-smooth hide-scrollbar">
                {conversationMessages.length > 0 ? (
                    <div className="space-y-6">
                        {conversationMessages.map((msg, idx) => {
                            const isMe = msg.senderId === 'alex-sterling';
                            const showAvatar = !isMe && (idx === 0 || conversationMessages[idx - 1].senderId !== msg.senderId);

                            return (
                                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} gap-3 group animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                                    {!isMe && (
                                        <div className="w-8 shrink-0">
                                            {showAvatar && (
                                                <img
                                                    src={msg.senderAvatar}
                                                    alt={msg.senderName}
                                                    className="size-8 rounded-xl border border-white/10 shadow-sm"
                                                />
                                            )}
                                        </div>
                                    )}

                                    <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[85%]`}>
                                        <div
                                            className={`px-4 py-3 rounded-[1.25rem] shadow-lg ${isMe
                                                ? 'bg-primary text-background-dark font-medium rounded-tr-sm'
                                                : 'bg-white/5 border border-white/10 text-white rounded-tl-sm'
                                                }`}
                                        >
                                            <p className="text-[13px] leading-relaxed break-words">{msg.content}</p>
                                        </div>
                                        <div className="flex items-center gap-1.5 mt-1.5 px-1">
                                            <span className="text-slate-600 text-[9px] font-black uppercase tracking-tighter">{formatTime(msg.timestamp)}</span>
                                            {isMe && getStatusIcon(msg.status)}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full opacity-40">
                        <div className="size-20 bg-white/5 rounded-[2rem] border border-white/10 flex items-center justify-center mb-6 shadow-inner">
                            <span className="material-symbols-outlined text-3xl text-slate-500">chat</span>
                        </div>
                        <h3 className="text-white font-black text-xl mb-2 tracking-tight">Start the Thread</h3>
                        <p className="text-slate-500 text-sm max-w-[200px] text-center leading-relaxed">Reach out to {otherUser.displayName} to coordinate your next venture.</p>
                    </div>
                )}
            </div>

            {/* Input */}
            <div className="sticky bottom-0 bg-background-dark/80 backdrop-blur-xl border-t border-white/5 px-6 py-6 transition-all">
                <div className="flex items-end gap-3 max-w-4xl mx-auto">
                    <div className="flex-1 relative">
                        <textarea
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend();
                                }
                            }}
                            placeholder="Type an inspiring message..."
                            rows={1}
                            className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-[1.5rem] text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-primary/30 transition-all resize-none shadow-inner"
                            style={{ minHeight: '52px', maxHeight: '150px' }}
                        />
                    </div>

                    <button
                        onClick={handleSend}
                        disabled={!inputText.trim()}
                        className={`size-[52px] flex items-center justify-center rounded-2xl transition-all shrink-0 ${inputText.trim()
                            ? 'bg-primary text-background-dark hover:scale-105 active:scale-95 shadow-xl shadow-primary/20'
                            : 'bg-white/5 text-slate-700 cursor-not-allowed'
                            }`}
                    >
                        <span className="material-symbols-outlined text-[20px] font-black">send</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MessageThread;
