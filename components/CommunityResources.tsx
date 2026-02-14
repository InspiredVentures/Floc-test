import React, { useState } from 'react';
import { CommunityResource } from '../types';

interface Props {
    resources: CommunityResource[];
    onAddResource?: (resource: Omit<CommunityResource, 'id' | 'downloadCount'>) => void;
}

export const CommunityResources: React.FC<Props> = ({ resources, onAddResource }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [newResource, setNewResource] = useState({
        title: '',
        type: 'Doc',
        url: '',
        size: '1.2 MB', // Mock default
        icon: 'description'
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (onAddResource) {
            onAddResource(newResource);
            setIsAdding(false);
            setNewResource({ title: '', type: 'Doc', url: '', size: '1.2 MB', icon: 'description' });
        }
    };

    if (!isAdding && resources.length === 0) {
        return (
            <div className="text-center py-6">
                <p className="text-primary/40 text-[10px] font-black uppercase tracking-widest mb-2">No resources yet</p>
                {onAddResource && (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="text-[9px] font-black uppercase tracking-widest text-accent hover:underline"
                    >
                        + Add Resource
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-2">
            {isAdding ? (
                <form onSubmit={handleSubmit} className="bg-white p-3 rounded-2xl border border-primary/10 space-y-2 animate-in fade-in slide-in-from-top-1">
                    <div className="flex justify-between items-center">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-primary">Upload Resource</h4>
                        <button type="button" onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-primary">
                            <span className="material-symbols-outlined text-sm">close</span>
                        </button>
                    </div>
                    <input
                        type="text"
                        placeholder="Title"
                        className="w-full bg-slate-50 border border-primary/10 rounded-lg px-2 py-1.5 text-xs text-primary outline-none focus:border-accent"
                        required
                        value={newResource.title}
                        onChange={e => setNewResource({ ...newResource, title: e.target.value })}
                        autoFocus
                    />
                    <input
                        type="text"
                        placeholder="URL (e.g. Drive link)"
                        className="w-full bg-slate-50 border border-primary/10 rounded-lg px-2 py-1.5 text-xs text-primary outline-none focus:border-accent"
                        required
                        value={newResource.url}
                        onChange={e => setNewResource({ ...newResource, url: e.target.value })}
                    />
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="bg-primary text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg hover:bg-black transition-colors"
                        >
                            Add
                        </button>
                    </div>
                </form>
            ) : (
                <>
                    {onAddResource && (
                        <div className="flex justify-end -mt-2 mb-2">
                            <button
                                onClick={() => setIsAdding(true)}
                                className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-accent hover:text-primary transition-colors"
                            >
                                <span className="material-symbols-outlined text-sm">upload_file</span>
                                Add Resource
                            </button>
                        </div>
                    )}
                    {resources.map(res => (
                        <a
                            key={res.id}
                            href={res.url}
                            className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-primary/5 hover:border-accent/30 hover:shadow-sm transition-all group"
                        >
                            <div className="size-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center group-hover:bg-accent/10 group-hover:text-accent transition-colors">
                                <span className="material-symbols-outlined text-lg">{res.icon}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-primary font-bold text-xs truncate group-hover:text-accent transition-colors">{res.title}</h4>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-[9px] font-bold text-primary/40 uppercase tracking-widest">{res.type}</span>
                                    <span className="text-[9px] font-medium text-slate-300">•</span>
                                    <span className="text-[9px] font-medium text-slate-400">{res.size}</span>
                                </div>
                            </div>
                            <span className="material-symbols-outlined text-primary/20 group-hover:text-accent transform group-hover:translate-x-0.5 transition-all">download</span>
                        </a>
                    ))}
                </>
            )}
        </div>
    );
};
