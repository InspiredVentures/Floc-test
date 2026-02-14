import React from 'react';
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { COLORS } from '../constants';

interface ActivityChartProps {
    data: { name: string; active: number }[];
    onOpenInsights?: () => void;
}

export const ActivityChart: React.FC<ActivityChartProps> = ({ data, onOpenInsights }) => {
    return (
        <section className="bg-white rounded-[2rem] p-6 border border-primary/5 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-primary font-heading font-black text-lg italic uppercase">Activity Pulse</h3>
                    <p className="text-[10px] text-primary/40 uppercase tracking-widest font-bold">Last 7 Days</p>
                </div>
                <button onClick={onOpenInsights} className="size-8 rounded-full bg-primary/5 hover:bg-primary/10 flex items-center justify-center transition-colors">
                    <span className="material-symbols-outlined text-primary/60 text-sm">fullscreen</span>
                </button>
            </div>

            <div className="h-40 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.1} />
                                <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <Tooltip
                            cursor={{ stroke: COLORS.primary, strokeWidth: 1, strokeDasharray: '4 4' }}
                            contentStyle={{
                                backgroundColor: '#fff',
                                border: '1px solid rgba(0,0,0,0.05)',
                                borderRadius: '12px',
                                fontSize: '12px',
                                color: COLORS.primary,
                                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                            }}
                            itemStyle={{ color: COLORS.primary, fontWeight: 'bold' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="active"
                            stroke={COLORS.primary}
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorActive)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </section>
    );
};
