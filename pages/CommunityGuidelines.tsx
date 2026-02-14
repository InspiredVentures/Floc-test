import React from 'react';
import { useNavigate } from 'react-router-dom';

const CommunityGuidelines: React.FC = () => {
    const navigate = useNavigate();

    const topRules = [
        {
            icon: 'favorite',
            title: 'Kindness is King',
            desc: 'We are a community of dreamers and doers. Lift each other up. Zero tolerance for bullying or harassment.'
        },
        {
            icon: 'lock',
            title: 'Respect Privacy',
            desc: 'What happens in the tribe, stays in the tribe. Do not share personal information or private content without consent.'
        },
        {
            icon: 'handshake',
            title: 'Honest Engagement',
            desc: 'Be yourself. No spam, scams, or misleading content. Authentic connections only.'
        },
        {
            icon: 'safety_check',
            title: 'Safety First',
            desc: 'Report any behavior that makes you feel unsafe. We are here to protect the vibe.'
        }
    ];

    return (
        <div className="min-h-screen bg-background-dark pb-24">
            {/* Header */}
            <div className="sticky top-0 z-50 p-6 flex justify-between items-center bg-background-dark/80 backdrop-blur-md border-b border-white/5">
                <button
                    onClick={() => navigate(-1)}
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all bg-blur"
                >
                    <span className="material-symbols-outlined text-white">arrow_back</span>
                </button>
                <div className="flex flex-col items-center">
                    <span className="text-xs font-black tracking-widest uppercase text-white/50">Floc Protocol</span>
                    <span className="text-sm font-bold text-white">Community Guidelines</span>
                </div>
                <div className="w-10" />
            </div>

            <div className="p-6 max-w-2xl mx-auto space-y-8 animate-fade-in-up">

                {/* Intro */}
                <div className="text-center space-y-4 py-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-2">
                        <span className="material-symbols-outlined text-3xl text-primary">gavel</span>
                    </div>
                    <h1 className="text-3xl font-black text-white">Protect the Vibe</h1>
                    <p className="text-slate-400 text-lg leading-relaxed">
                        Floc is a curated space for meaningful connection. To keep it that way, we ask every member to agree to these core principles.
                    </p>
                </div>

                {/* Rules Grid */}
                <div className="grid gap-4">
                    {topRules.map((rule, i) => (
                        <div key={i} className="flex gap-5 p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/[0.07] transition-all duration-300">
                            <span className="material-symbols-outlined text-primary text-3xl shrink-0 mt-1">{rule.icon}</span>
                            <div>
                                <h3 className="text-white font-bold text-lg mb-2">{rule.title}</h3>
                                <p className="text-slate-400 leading-relaxed text-sm">
                                    {rule.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Detailed Accordion / Sections */}
                <div className="space-y-6 pt-8 border-t border-white/10">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-4">Detailed Policy</h3>

                    <GuidelineSection
                        title="Hate Speech Policy"
                        content="We do not tolerate hate speech based on race, ethnicity, national origin, religion, caste, sexual orientation, sex, gender, gender identity, or serious disease or disability."
                    />
                    <GuidelineSection
                        title="Nudity and Sexual Content"
                        content="We strictly prohibit content that involves sexual violence and assault. We also remove non-consensual sexual content."
                    />
                    <GuidelineSection
                        title="Violence and Criminal Behavior"
                        content="Any threat of violence or promotion of illegal activities will result in an immediate ban and report to authorities."
                    />
                </div>

                {/* Contact */}
                <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/10 p-6 rounded-2xl text-center space-y-4 mt-8">
                    <h4 className="text-white font-bold">See something? Say something.</h4>
                    <p className="text-slate-400 text-sm">
                        If you spot a violation, please report it immediately. Our team reviews flags 24/7.
                    </p>
                    <button className="bg-white text-background-dark font-bold px-6 py-3 rounded-xl hover:scale-105 transition-transform">
                        Report an Issue
                    </button>
                </div>

                <p className="text-center text-slate-600 text-xs mt-12">
                    Last Updated: Feb 10, 2026
                </p>

            </div>
        </div>
    );
};

const GuidelineSection: React.FC<{ title: string, content: string }> = ({ title, content }) => (
    <div className="space-y-2">
        <h4 className="text-white font-bold">{title}</h4>
        <p className="text-slate-400 text-sm leading-relaxed">{content}</p>
    </div>
);

export default CommunityGuidelines;
