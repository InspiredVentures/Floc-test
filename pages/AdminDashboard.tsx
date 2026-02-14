import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    FileText,
    Image as ImageIcon,
    Settings,
    Plus,
    Save,
    Trash2,
    ExternalLink,
    Search,
    Filter
} from 'lucide-react';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('posts');

    const posts = [
        { id: 1, title: "Our mission to Borneo", author: "Sheila", date: "Oct 12, 2025", status: "Published" },
        { id: 2, title: "Nepal Tiger Trust Partnership", author: "Sheila", date: "Sep 28, 2025", status: "Published" },
        { id: 3, title: "Upcoming Morocco Relief Mission", author: "Admin", date: "Jan 15, 2026", status: "Draft" }
    ];

    const trips = [
        { id: 1, title: "Borneo Highlights", price: "£2,450", status: "Active" },
        { id: 2, title: "Nepal Tiger Tracking", price: "£3,100", status: "Full" },
        { id: 3, title: "Cambodia Mobility", price: "£1,900", status: "Active" }
    ];

    return (
        <div className="flex min-h-screen bg-[#F8FAFC]">
            {/* Sidebar */}
            <div className="w-64 bg-primary text-white flex flex-col p-6 shadow-2xl">
                <div className="flex items-center gap-3 mb-12">
                    <img src="/images/eva/Eva Logo.avif" alt="EVA" className="h-8 w-auto invert brightness-0" />
                    <span className="font-heading font-bold text-xl italic">Admin</span>
                </div>

                <nav className="flex-1 space-y-2">
                    {[
                        { id: 'dashboard', icon: <LayoutDashboard className="w-5 h-5" />, label: "Dashboard" },
                        { id: 'posts', icon: <FileText className="w-5 h-5" />, label: "Blog Posts" },
                        { id: 'trips', icon: <ImageIcon className="w-5 h-5" />, label: "Manage Trips" },
                        { id: 'settings', icon: <Settings className="w-5 h-5" />, label: "Site Settings" }
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === item.id ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'hover:bg-white/10'
                                }`}
                        >
                            {item.icon}
                            <span className="font-medium">{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="mt-auto pt-6 border-t border-white/10">
                    <a href="/" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm">
                        <ExternalLink className="w-4 h-4" />
                        View Live Site
                    </a>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto p-10">
                <header className="flex justify-between items-end mb-10">
                    <div>
                        <h1 className="text-3xl font-heading font-bold text-primary capitalize">{activeTab}</h1>
                        <p className="text-slate-500">Manage your website content and trip listings.</p>
                    </div>
                    <button className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full font-bold hover:bg-accent transition-all shadow-md">
                        <Plus className="w-5 h-5" />
                        Create New {activeTab === 'posts' ? 'Post' : 'Trip'}
                    </button>
                </header>

                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <div className="relative max-w-sm flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-full pl-12 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                            />
                        </div>
                        <div className="flex gap-2">
                            <button className="p-2 hover:bg-white rounded-lg border border-slate-200"><Filter className="w-4 h-4" /></button>
                        </div>
                    </div>

                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">Title</th>
                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">
                                    {activeTab === 'posts' ? 'Author' : 'Price'}
                                </th>
                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">Status</th>
                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(activeTab === 'posts' ? posts : trips).map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-5 border-b border-slate-100">
                                        <div className="font-bold text-primary">{item.title}</div>
                                        {activeTab === 'posts' && <div className="text-xs text-slate-400">{item.date}</div>}
                                    </td>
                                    <td className="px-6 py-5 border-b border-slate-100 text-slate-600">
                                        {activeTab === 'posts' ? item.author : item.price}
                                    </td>
                                    <td className="px-6 py-5 border-b border-slate-100">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${item.status === 'Published' || item.status === 'Active'
                                            ? 'bg-primary/10 text-primary'
                                            : 'bg-accent/10 text-accent'
                                            }`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 border-b border-slate-100 text-right">
                                        <div className="flex gap-2 justify-end">
                                            <button className="p-2 hover:bg-accent/10 rounded-lg text-slate-400 hover:text-accent transition-colors">
                                                <ImageIcon className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 hover:bg-primary/10 rounded-lg text-slate-400 hover:text-primary transition-colors">
                                                <Save className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 hover:bg-rose-100 rounded-lg text-slate-400 hover:text-rose-700 transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
