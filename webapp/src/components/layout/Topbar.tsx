'use client';
import { Search, Bell, Plus, FileUp } from 'lucide-react';
import { useState } from 'react';
import { CreateTicketModal } from '../tickets/CreateTicketModal';
import { ExcelUploadModal } from '../upload/ExcelUpload';

export function Topbar() {
    const [isTicketOpen, setTicketOpen] = useState(false);
    const [isUploadOpen, setUploadOpen] = useState(false);

    return (
        <>
            <header className="h-16 border-b bg-white flex items-center justify-between px-4 md:px-8 shrink-0">
                <div className="flex flex-1 gap-4 items-center">
                    <button className="flex items-center gap-2 text-sm text-zinc-400 border rounded-lg px-3 py-1.5 w-full max-w-sm hover:border-zinc-300 hover:text-zinc-600 transition-colors">
                        <Search className="w-4 h-4" />
                        <span>Search tickets... (Cmd+K)</span>
                    </button>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={() => setUploadOpen(true)} className="flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-50 text-zinc-700">
                        <FileUp className="w-4 h-4" /> Upload
                    </button>
                    <button onClick={() => setTicketOpen(true)} className="flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white">
                        <Plus className="w-4 h-4" /> New Ticket
                    </button>

                    <div className="w-px h-6 bg-zinc-200 mx-2"></div>

                    <button className="text-zinc-500 hover:text-zinc-700 mx-1">
                        <Bell className="w-5 h-5" />
                    </button>
                    <div className="w-8 h-8 rounded-full bg-zinc-200 border border-zinc-300 ml-1"></div>
                </div>
            </header>

            <CreateTicketModal isOpen={isTicketOpen} onClose={() => setTicketOpen(false)} />
            <ExcelUploadModal isOpen={isUploadOpen} onClose={() => setUploadOpen(false)} />
        </>
    )
}
