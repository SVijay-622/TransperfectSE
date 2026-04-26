'use client';

import { trpc } from '@/utils/trpc';
import { X, Clock, User, AlertCircle } from 'lucide-react';
import { useEffect } from 'react';

export function TicketDetailsDrawer({ ticketId, onClose }: { ticketId: string | null, onClose: () => void }) {
    const { data: ticket, isLoading } = trpc.ticket.getDetails.useQuery(
        { id: ticketId! },
        { enabled: !!ticketId }
    );

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    if (!ticketId) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black/20 z-40 transition-opacity" onClick={onClose} />
            <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col border-l">
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-lg font-semibold tracking-tight">Ticket Details</h2>
                    <button onClick={onClose} className="p-2 text-zinc-500 hover:text-zinc-900 rounded-lg hover:bg-zinc-100 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    {isLoading ? (
                        <div className="flex h-32 items-center justify-center text-zinc-500">Loading details...</div>
                    ) : !ticket ? (
                        <div className="flex h-32 items-center justify-center text-red-500 flex-col gap-2">
                            <AlertCircle className="w-6 h-6" />
                            Ticket not found
                        </div>
                    ) : (
                        <div className="flex flex-col gap-6">
                            <div>
                                <div className="text-xs font-semibold text-zinc-500 mb-1">{ticket.externalId}</div>
                                <h1 className="text-2xl font-bold leading-tight text-zinc-900">{ticket.title}</h1>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className={`px-3 py-1 text-sm rounded-full font-medium ${ticket.status === 'Closed' ? 'bg-zinc-100 text-zinc-600' :
                                        ticket.status === 'Open' ? 'bg-blue-100 text-blue-700' :
                                            'bg-orange-100 text-orange-700'
                                    }`}>
                                    {ticket.status}
                                </span>
                                <span className="px-3 py-1 text-sm rounded-full bg-zinc-100 font-medium text-zinc-700">
                                    {ticket.priority} Priority
                                </span>
                            </div>

                            <div className="flex flex-col gap-3 p-4 bg-zinc-50 rounded-xl border">
                                <div className="flex items-center gap-3 text-sm">
                                    <Clock className="w-4 h-4 text-zinc-500" />
                                    <span className="text-zinc-600 w-24">Created:</span>
                                    <span className="font-medium">{new Date(ticket.createdAt).toLocaleString()}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <Clock className="w-4 h-4 text-zinc-500" />
                                    <span className="text-zinc-600 w-24">Updated:</span>
                                    <span className="font-medium">{new Date(ticket.updatedAt).toLocaleString()}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <User className="w-4 h-4 text-zinc-500" />
                                    <span className="text-zinc-600 w-24">Assignee:</span>
                                    <span className="font-medium">{ticket.assigneeName || 'Unassigned'}</span>
                                </div>
                            </div>

                            <div className="mt-4 border-t pt-6">
                                <h3 className="font-semibold mb-2">Description</h3>
                                <div className="text-zinc-700 whitespace-pre-wrap text-sm leading-relaxed">
                                    {ticket.description || "No description provided."}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
