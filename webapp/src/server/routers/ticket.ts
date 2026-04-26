import { router, publicProcedure } from '../trpc';
import { z } from 'zod';
import prisma from '@/lib/prisma';

export const ticketRouter = router({
    list: publicProcedure
        .input(z.object({
            cursor: z.string().nullish(),
            limit: z.number().min(1).max(100).default(50),
            status: z.string().optional(),
            assigneeName: z.string().optional(),
            search: z.string().optional()
        }))
        .query(async ({ input }) => {
            const { cursor, limit, status, assigneeName, search } = input;

            const items = await prisma.ticket.findMany({
                take: limit + 1,
                cursor: cursor ? { id: cursor } : undefined,
                where: {
                    ...(status ? { status } : {}),
                    ...(assigneeName ? { assigneeName } : {}),
                    ...(search ? { title: { contains: search, mode: 'insensitive' } } : {})
                },
                orderBy: { createdAt: 'desc' }
            });

            let nextCursor: typeof cursor | undefined = undefined;
            if (items.length > limit) {
                const nextItem = items.pop();
                nextCursor = nextItem!.id;
            }

            return { items, nextCursor };
        }),

    create: publicProcedure
        .input(
            z.object({
                externalId: z.string(),
                title: z.string(),
                description: z.string().optional(),
                status: z.string().default('Open'),
                priority: z.string().default('Medium'),
                assigneeName: z.string().optional()
            })
        )
        .mutation(async ({ input }) => {
            const now = new Date();
            const ticket = await prisma.ticket.create({
                data: {
                    ...input,
                    createdAt: now,
                    updatedAt: now,
                }
            });
            return ticket;
        }),

    getDetails: publicProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ input }) => {
            return await prisma.ticket.findUnique({
                where: { id: input.id },
            });
        })
});
