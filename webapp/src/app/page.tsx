import DashboardLayout from "@/components/layout/DashboardLayout";
import { TicketTable } from "@/components/tickets/TicketTable";
import { DashboardMetrics } from "@/components/analytics/DashboardMetrics";
import { DailyTrendsChart } from "@/components/analytics/DailyTrendsChart";

export default function Home() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard Overview</h1>
        <p className="text-zinc-500">Welcome to the Ticket Activity Platform.</p>

        <DashboardMetrics />

        {/* Charts and Tables */}
        <div className="mt-8 flex flex-col gap-6">
          <DailyTrendsChart />
          <TicketTable />
        </div>
      </div>
    </DashboardLayout>
  );
}
