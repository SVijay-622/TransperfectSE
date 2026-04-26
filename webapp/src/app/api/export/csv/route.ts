import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/rbac';

export async function GET(request: Request) {
    const authError = await requireAdmin(request);
    if (authError) return authError;

    const tickets = await prisma.ticket.findMany({
        where: { status: { not: 'Closed' } },
        select: {
            externalId: true,
            title: true,
            status: true,
            priority: true,
            createdAt: true,
            assigneeName: true
        },
        orderBy: { createdAt: 'desc' }
    });

    const header = ['ID', 'Title', 'Status', 'Priority', 'Created At', 'Assignee'].join(',');
    const rows = tickets.map(t => [
        t.externalId,
        `"${t.title.replace(/"/g, '""')}"`,
        t.status,
        t.priority,
        t.createdAt.toISOString(),
        t.assigneeName || 'Unassigned'
    ].join(','));

    const csvContent = [header, ...rows].join('\n');

    return new NextResponse(csvContent, {
        headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': 'attachment; filename="open_tickets_report.csv"'
        }
    });
}
