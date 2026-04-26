'use client';

import { useRef, useState } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { trpc } from '@/utils/trpc';
import { TicketDetailsDrawer } from './TicketDetailsDrawer';

export function TicketTable() {
    const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

    const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = trpc.ticket.list.useInfiniteQuery(
        { limit: 50 },
        {
            getNextPageParam: (lastPage) => lastPage.nextCursor,
        }
    );

    const tickets = data?.pages.flatMap((page) => page.items) ?? [];
    const parentRef = useRef<HTMLDivElement>(null);

    const rowVirtualizer = useVirtualizer({
        count: hasNextPage ? tickets.length + 1 : tickets.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 48,
        overscan: 10,
    });

    return (
        <>
            <div className="w-full flex-1 flex flex-col border rounded-xl overflow-hidden bg-white">
                <div className="flex bg-zinc-50 border-b p-3 px-4 font-semibold text-sm text-zinc-500">
                    <div className="w-1/4">ID</div>
                    <div className="w-1/2">Title</div>
                    <div className="w-1/4 flex justify-end">Status</div>
                </div>
                <div ref={parentRef} className="h-[600px] overflow-auto relative">
                    {isLoading ? (
                        <div className="flex p-8 items-center justify-center text-zinc-500">Loading tickets...</div>
                    ) : (
                        <div
                            style={{
                                height: `${rowVirtualizer.getTotalSize()}px`,
                                width: '100%',
                                position: 'relative',
                            }}
                        >
                            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                                const isLoaderRow = virtualRow.index > tickets.length - 1;

                                if (isLoaderRow) {
                                    if (hasNextPage && !isFetchingNextPage) {
                                        fetchNextPage();
                                    }
                                    return (
                                        <div
                                            key={`loader-${virtualRow.index}`}
                                            style={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: '100%',
                                                height: `${virtualRow.size}px`,
                                                transform: `translateY(${virtualRow.start}px)`,
                                            }}
                                            className="flex items-center justify-center text-sm text-zinc-500 px-4"
                                        >
                                            Loading more...
                                        </div>
                                    );
                                }

                                const ticket = tickets[virtualRow.index];
                                return (
                                    <div
                                        key={virtualRow.index}
                                        onClick={() => setSelectedTicketId(ticket.id)}
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: `${virtualRow.size}px`,
                                            transform: `translateY(${virtualRow.start}px)`,
                                        }}
                                        className="flex items-center border-b px-4 hover:bg-zinc-50 text-sm cursor-pointer"
                                    >
                                        <span className="w-1/4 font-medium text-zinc-900">{ticket.externalId}</span>
                                        <span className="w-1/2 text-zinc-600 truncate pr-4">{ticket.title}</span>
                                        <span className="w-1/4 flex justify-end">
                                            <span className={`px-2.5 py-1 text-xs rounded-full font-medium ${ticket.status === 'Closed' ? 'bg-zinc-100 text-zinc-600' :
                                                ticket.status === 'Open' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-orange-100 text-orange-700'
                                                }`}>
                                                {ticket.status}
                                            </span>
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
            <TicketDetailsDrawer ticketId={selectedTicketId} onClose={() => setSelectedTicketId(null)} />
        </>
    );
}
