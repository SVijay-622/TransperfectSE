import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen bg-zinc-50 overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <Topbar />
                <main className="flex-1 overflow-y-auto w-full max-w-7xl mx-auto p-4 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    )
}
