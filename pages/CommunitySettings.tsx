import React, { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { Community } from '../types';

interface Props {
    onBack: () => void;
}

const CommunitySettings: React.FC<Props> = ({ onBack }) => {
    const { communities, updateCommunity, deleteCommunity } = useUser();
    const community = communities.find(c => c.isManaged) || communities[0];

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        accessType: 'free' as 'free' | 'request',
        image: ''
    });

    useEffect(() => {
        if (community) {
            setFormData({
                title: community.title,
                description: community.description,
                category: community.category,
                accessType: community.accessType,
                image: community.image
            });
        }
    }, [community]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (community) {
            updateCommunity(community.id, formData);
            alert('Settings updated successfully!');
            onBack();
        }
    };

    if (!community) return null;

    const handleDissolve = async () => {
        if (!community) return;

        if (window.confirm(`Are you sure you want to dissolve "${community.title}"? This action cannot be undone.`)) {
            try {
                await deleteCommunity(community.id);
                // Navigate home or to list
                onBack(); // Go back to manage
                // Ideally default back to dashboard via parent routing?
            } catch (e) {
                console.error("Dissolve failed", e);
            }
        }
    };

    return (
        <div className="flex flex-col min-h-full bg-background-dark">
            <header className="px-4 pt-10 pb-6 flex items-center gap-4 sticky top-0 bg-background-dark/95 backdrop-blur-md z-50 border-b border-white/5">
                <button onClick={onBack} className="text-white p-2 hover:bg-white/5 rounded-full transition-colors active:scale-90">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <div className="flex-1">
                    <h1 className="text-2xl font-black text-white tracking-tight leading-none">Community Settings</h1>
                    <p className="text-[10px] text-primary font-bold uppercase tracking-[0.2em] mt-1">Configure Identity</p>
                </div>
            </header>

            <main className="p-6 pb-32 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2 block px-1">Community Title</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-primary outline-none transition-all font-bold"
                            />
                        </div>

                        <div>
                            <label className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2 block px-1">Mission / Description</label>
                            <textarea
                                rows={4}
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-primary outline-none transition-all resize-none text-sm"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2 block px-1">Category</label>
                                <input
                                    type="text"
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-primary outline-none transition-all text-sm"
                                />
                            </div>
                            <div>
                                <label className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2 block px-1">Access Policy</label>
                                <select
                                    value={formData.accessType}
                                    onChange={e => setFormData({ ...formData, accessType: e.target.value as any })}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-primary outline-none text-sm"
                                >
                                    <option value="free">Join Freely</option>
                                    <option value="request">Request Access</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2 block px-1">Cover Image URL</label>
                            <input
                                type="text"
                                value={formData.image}
                                onChange={e => setFormData({ ...formData, image: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-primary outline-none transition-all text-xs"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-primary text-background-dark font-black py-5 rounded-2xl shadow-xl shadow-primary/20 active:scale-95 transition-all text-sm uppercase tracking-widest"
                    >
                        Save Community Identity
                    </button>
                </form>

                <section className="pt-8 border-t border-white/5">
                    <h3 className="text-red-500 text-[10px] font-black uppercase tracking-widest mb-4 px-1">Danger Zone</h3>
                    <button
                        onClick={handleDissolve}
                        className="w-full bg-red-500/10 border border-red-500/20 text-red-500 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500/20 transition-all">
                        Dissolve Community
                    </button>
                </section>
            </main>
        </div>
    );
};

export default CommunitySettings;
