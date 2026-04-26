import { router, publicProcedure } from '../trpc';
import { ticketRouter } from './ticket';
import { analyticsRouter } from './analytics';

export const appRouter = router({
    healthcheck: publicProcedure.query(() => 'System is online'),
    ticket: ticketRouter,
    analytics: analyticsRouter,
});

export type AppRouter = typeof appRouter;
