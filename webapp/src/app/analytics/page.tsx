import DashboardLayout from "@/components/layout/DashboardLayout";
import { DashboardMetrics } from "@/components/analytics/DashboardMetrics";
import { DailyTrendsChart } from "@/components/analytics/DailyTrendsChart";

export default function AnalyticsPage() {
    return (
        <DashboardLayout>
            <div className="flex flex-col gap-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
                    <p className="text-zinc-500 mt-1">Key metrics, trends, and workload distribution.</p>
                </div>
                <DashboardMetrics />
                <DailyTrendsChart />
            </div>
        </DashboardLayout>
    );
}
