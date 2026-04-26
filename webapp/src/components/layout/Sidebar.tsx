'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Ticket, BarChart3, Settings } from 'lucide-react';

const navItems = [
    { href: '/', label: 'Overview', icon: LayoutDashboard },
    { href: '/tickets', label: 'Tickets', icon: Ticket },
    { href: '/analytics', label: 'Analytics', icon: BarChart3 },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 border-r bg-white hidden md:flex md:flex-col h-full shrink-0 shadow-sm">
            <div className="h-16 flex items-center px-6 border-b font-bold tracking-tight text-xl text-zinc-900">
                TicketPlatform
            </div>
            <nav className="flex-1 p-4 space-y-1">
                {navItems.map(({ href, label, icon: Icon }) => {
                    const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${isActive
                                    ? 'bg-zinc-100 text-zinc-900'
                                    : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
                                }`}
                        >
                            <Icon className="w-5 h-5" />
                            {label}
                        </Link>
                    );
                })}
            </nav>
            <div className="p-4 border-t">
                <Link href="/settings" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-colors">
                    <Settings className="w-5 h-5" />
                    Settings
                </Link>
            </div>
        </aside>
    )
}
