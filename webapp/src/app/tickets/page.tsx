import DashboardLayout from "@/components/layout/DashboardLayout";
import { TicketTable } from "@/components/tickets/TicketTable";

export default function TicketsPage() {
    return (
        <DashboardLayout>
            <div className="flex flex-col gap-4">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Tickets</h1>
                    <p className="text-zinc-500 mt-1">Browse, search, and manage all tickets.</p>
                </div>
                <TicketTable />
            </div>
        </DashboardLayout>
    );
}
