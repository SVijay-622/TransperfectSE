'use client';

import { useState } from 'react';
import { trpc } from '@/utils/trpc';
import { X } from 'lucide-react';

export function CreateTicketModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    const utils = trpc.useContext();
    const [formData, setFormData] = useState({
        externalId: '',
        title: '',
        description: '',
        status: 'Open',
        priority: 'Medium',
        assigneeName: ''
    });

    const createMutation = trpc.ticket.create.useMutation({
        onSuccess: () => {
            utils.ticket.list.invalidate();
            onClose();
        },
        onError: (err) => {
            alert("Error creating ticket: " + err.message);
        }
    });

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 flex flex-col gap-4 relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-900"><X className="w-5 h-5" /></button>
                <h2 className="text-xl font-bold">Create New Ticket</h2>

                <form className="flex flex-col gap-3" onSubmit={(e) => { e.preventDefault(); createMutation.mutate(formData); }}>
                    <div>
                        <label className="text-sm font-medium">Ticket ID *</label>
                        <input required className="w-full border rounded-lg px-3 py-2 mt-1" value={formData.externalId} onChange={e => setFormData({ ...formData, externalId: e.target.value })} placeholder="e.g. 182560" />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Title *</label>
                        <input required className="w-full border rounded-lg px-3 py-2 mt-1" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="Brief description" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium">Status</label>
                            <select className="w-full border rounded-lg px-3 py-2 mt-1 bg-white" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                                <option>Open</option>
                                <option>Jira In Progress</option>
                                <option>ACR</option>
                                <option>Closed</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-medium">Assignee</label>
                            <input className="w-full border rounded-lg px-3 py-2 mt-1" value={formData.assigneeName} onChange={e => setFormData({ ...formData, assigneeName: e.target.value })} placeholder="e.g. Vijayandiran S." />
                        </div>
                    </div>
                    <div>
                        <label className="text-sm font-medium">Description</label>
                        <textarea className="w-full border rounded-lg px-3 py-2 mt-1" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} rows={3} />
                    </div>

                    <button type="submit" disabled={createMutation.isPending} className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 font-medium">
                        {createMutation.isPending ? 'Creating...' : 'Create Ticket'}
                    </button>
                </form>
            </div>
        </div>
    );
}
