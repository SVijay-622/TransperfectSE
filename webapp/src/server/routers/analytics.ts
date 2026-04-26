import { router, publicProcedure } from '../trpc';
import { z } from 'zod';
import prisma from '@/lib/prisma';

export const analyticsRouter = router({
    getCurrentMetrics: publicProcedure.query(async () => {
        const now = new Date();
        const openCount = await prisma.ticket.count({ where: { status: { not: 'Closed' } } });
        const closedCount = await prisma.ticket.count({ where: { status: 'Closed' } });
        const fiveDaysAgo = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000);
        const slaBreaches = await prisma.ticket.count({
            where: { status: { not: 'Closed' }, createdAt: { lt: fiveDaysAgo } }
        });
        const openTickets = await prisma.ticket.findMany({
            where: { status: { not: 'Closed' } }, select: { createdAt: true }
        });
        let totalAgeMs = 0;
        openTickets.forEach((t: { createdAt: Date }) => totalAgeMs += (now.getTime() - t.createdAt.getTime()));
        const avgAgeHours = openTickets.length > 0 ? (totalAgeMs / openTickets.length) / (1000 * 60 * 60) : 0;
        return { openCount, closedCount, slaBreaches, avgAgeHours };
    }),

    getAgingReport: publicProcedure
        .query(async () => {
            const report: any[] = await prisma.$queryRaw`
        SELECT 
          CASE 
            WHEN age(now(), "createdAt") < interval '3 days' THEN '0-2 Days'
            WHEN age(now(), "createdAt") < interval '6 days' THEN '3-5 Days'
            ELSE '5+ Days'
          END as bucket,
          COUNT(*)::int as count
        FROM "Ticket"
        WHERE status != 'Closed'
        GROUP BY 1
        ORDER BY 1
      `;
            return report;
        }),

    getWorkloadDistribution: publicProcedure
        .query(async () => {
            const distribution = await prisma.ticket.groupBy({
                by: ['assigneeName'],
                _count: {
                    id: true
                },
                where: { status: { not: 'Closed' } }
            });
            return distribution;
        }),

    getDailyTrends: publicProcedure
        .input(z.object({ daysLookback: z.number().default(30) }))
        .query(async ({ input }) => {
            const trends = await prisma.dailyMetricsSnapshot.findMany({
                take: input.daysLookback,
                orderBy: { date: 'desc' }
            });
            return trends.reverse();
        })
});
