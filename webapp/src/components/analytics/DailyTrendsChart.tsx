'use client';

import { trpc } from '@/utils/trpc';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function DailyTrendsChart() {
    const { data, isLoading } = trpc.analytics.getDailyTrends.useQuery({ daysLookback: 30 });

    if (isLoading) return <div className="h-64 border rounded-xl flex items-center justify-center text-zinc-400 bg-zinc-50/50">Loading trends...</div>;

    const formattedData = data?.map((d: any) => ({
        name: new Date(d.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        Open: d.openCount,
        Closed: d.closedCount,
    })) ?? [];

    return (
        <div className="h-64 border rounded-xl p-4 bg-white shadow-sm">
            <h3 className="text-sm font-semibold mb-4 text-zinc-800">30-Day Ticket Trend</h3>
            <div className="w-full h-48">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorOpen" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis fontSize={12} tickLine={false} axisLine={false} />
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Area type="monotone" dataKey="Open" stroke="#3b82f6" fillOpacity={1} fill="url(#colorOpen)" strokeWidth={2} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
