'use client';
import { trpc } from '@/utils/trpc';

export function DashboardMetrics() {
    const { data, isLoading } = trpc.analytics.getCurrentMetrics.useQuery();

    if (isLoading) {
        return <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 animate-pulse">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-zinc-200 rounded-xl" />)}
        </div>
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
            <div className="p-4 border rounded-xl bg-white shadow-sm flex flex-col gap-1">
                <span className="text-sm font-medium text-zinc-500">Total Open</span>
                <span className="text-2xl font-bold">{data?.openCount ?? 0}</span>
            </div>
            <div className="p-4 border rounded-xl bg-white shadow-sm flex flex-col gap-1">
                <span className="text-sm font-medium text-zinc-500">SLA Breached (5+ days)</span>
                <span className="text-2xl font-bold text-red-600">{data?.slaBreaches ?? 0}</span>
            </div>
            <div className="p-4 border rounded-xl bg-white shadow-sm flex flex-col gap-1">
                <span className="text-sm font-medium text-zinc-500">Avg Age (Hours)</span>
                <span className="text-2xl font-bold">{(data?.avgAgeHours ?? 0).toFixed(1)}</span>
            </div>
            <div className="p-4 border rounded-xl bg-white shadow-sm flex flex-col gap-1">
                <span className="text-sm font-medium text-zinc-500">Closed Tickets</span>
                <span className="text-2xl font-bold text-green-600">{data?.closedCount ?? 0}</span>
            </div>
        </div>
    );
}
