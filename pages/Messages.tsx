import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

const Messages: React.FC = () => {
    const navigate = useNavigate();
    const { conversations, getTotalUnreadCount } = useUser();
    const [searchQuery, setSearchQuery] = useState('');

    const filteredConversations = conversations.filter(conv => {
        if (!searchQuery.trim()) return true;
        if (conv.type === 'group' && conv.title) {
            return conv.title.toLowerCase().includes(searchQuery.toLowerCase());
        }
        const otherParticipant = conv.participantDetails.find(p => p.username !== 'alex-sterling');
        return otherParticipant?.displayName.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const formatTimestamp = (timestamp?: number) => {
        if (!timestamp) return '';
        const now = Date.now();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m`;
        if (hours < 24) return `${hours}h`;
        if (days < 7) return `${days}d`;
        return new Date(timestamp).toLocaleDateString();
    };

    return (
        <div className="min-h-screen bg-background-dark pb-24 font-sans selection:bg-primary/30">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-background-dark/95 backdrop-blur-xl border-b border-white/5">
                <div className="px-6 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-5">
                        <button
                            onClick={() => navigate(-1)}
                            className="size-11 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 active:scale-90 transition-all"
                        >
                            <span className="material-symbols-outlined text-white text-[22px]">arrow_back</span>
                        </button>
                        <div>
                            <h1 className="text-white font-black text-2xl tracking-tighter">Inbox</h1>
                            <div className="flex items-center gap-2 mt-0.5">
                                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest leading-none">
                                    {getTotalUnreadCount()} Unread
                                </p>
                                {getTotalUnreadCount() > 0 && <span className="size-1 bg-primary rounded-full animate-pulse"></span>}
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate('/discovery')}
                        className="size-11 flex items-center justify-center rounded-2xl bg-primary text-background-dark hover:scale-110 active:scale-95 transition-all shadow-xl shadow-primary/20"
                    >
                        <span className="material-symbols-outlined font-black text-[22px]">edit_square</span>
                    </button>
                </div>

                {/* Search */}
                <div className="px-6 pb-5">
                    <div className="relative group">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-[20px] group-focus-within:text-primary transition-colors">
                            search
                        </span>
                        <input
                            type="text"
                            placeholder="Search your tribe..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-slate-600 text-sm focus:outline-none focus:border-primary/40 focus:bg-white/[0.07] transition-all shadow-inner"
                        />
                    </div>
                </div>
            </header>

            {/* Conversations List */}
            <div className="px-6 py-6 space-y-4">
                {filteredConversations.length > 0 ? (
                    <div className="space-y-3">
                        {filteredConversations.map((conversation) => {
                            const isGroup = conversation.type === 'group';
                            const otherParticipant = conversation.participantDetails.find(p => p.username !== 'alex-sterling');

                            const displayName = isGroup ? conversation.title : otherParticipant?.displayName;
                            const avatar = isGroup ? conversation.participantDetails[0]?.avatar : otherParticipant?.avatar; // Group might use a specific image or first participant
                            const route = isGroup ? `/chat/${conversation.id}` : `/messages/${otherParticipant?.username}`;

                            if (!isGroup && !otherParticipant) return null;

                            return (
                                <div
                                    key={conversation.id}
                                    onClick={() => navigate(route)}
                                    className={`relative bg-surface-dark/40 border border-white/5 rounded-[1.75rem] p-4 hover:border-primary/20 hover:bg-white/[0.03] transition-all cursor-pointer group ${conversation.unreadCount > 0 ? 'ring-1 ring-primary/20' : ''}`}
                                >
                                    <div className="flex gap-4 min-w-0">
                                        <div className="relative shrink-0">
                                            {isGroup ? (
                                                <div className="size-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-105 transition-transform overflow-hidden shadow-inner">
                                                    <span className="material-symbols-outlined text-2xl font-black">forum</span>
                                                </div>
                                            ) : (
                                                <img
                                                    src={avatar}
                                                    alt={displayName}
                                                    className="size-14 rounded-2xl border border-white/10 shadow-sm group-hover:border-primary/30 transition-all object-cover"
                                                />
                                            )}
                                            {!isGroup && otherParticipant?.isOnline && (
                                                <div className="absolute -bottom-1 -right-1 size-4 bg-accent border-4 border-background-dark rounded-full shadow-lg shadow-accent/20"></div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                                            <div className="flex justify-between items-start mb-1">
                                                <h3 className="text-[15px] font-black text-white tracking-tight truncate group-hover:text-primary transition-colors">
                                                    {displayName}
                                                </h3>
                                                <span className="text-[9px] text-slate-600 font-black uppercase tracking-widest mt-0.5">
                                                    {formatTimestamp(conversation.lastMessage?.timestamp)}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <p className={`text-[13px] line-clamp-1 flex-1 pr-4 ${conversation.unreadCount > 0 ? 'text-white font-bold' : 'text-slate-500 font-medium'}`}>
                                                    {conversation.lastMessage?.senderId === 'alex-sterling' ? (
                                                        <span className="text-primary/70 text-[10px] font-black uppercase tracking-tighter mr-1">You:</span>
                                                    ) : isGroup ? (
                                                        <span className="text-slate-400 text-[10px] font-bold mr-1">{conversation.lastMessage?.senderName}:</span>
                                                    ) : null}
                                                    {conversation.lastMessage?.content || 'Starting a new thread...'}
                                                </p>
                                                {conversation.unreadCount > 0 && (
                                                    <div className="px-2.5 py-1 rounded-full bg-primary text-background-dark text-[10px] font-black min-w-[22px] h-5 flex items-center justify-center animate-in zoom-in slide-in-from-right-3 duration-500 shadow-lg shadow-primary/20">
                                                        {conversation.unreadCount}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    {conversation.unreadCount > 0 && <div className="absolute top-4 right-4 size-2 bg-primary rounded-full shadow-sm shadow-primary/40"></div>}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-32 px-6">
                        <div className="size-28 bg-white/5 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 border border-white/10 shadow-inner group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-5xl text-slate-700">chat_bubble</span>
                        </div>
                        <h2 className="text-white font-black text-2xl mb-3 tracking-tighter">Quiet in the Cave</h2>
                        <p className="text-slate-500 text-sm max-w-[220px] mx-auto leading-relaxed font-medium">
                            {searchQuery ? 'No tribe members found with that name.' : 'Your next great venture starts with a simple hello.'}
                        </p>
                        {!searchQuery && (
                            <button
                                onClick={() => navigate('/discovery')}
                                className="mt-10 px-10 py-4 bg-primary text-background-dark rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all"
                            >
                                Discover Communities
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Messages;
