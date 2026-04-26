import { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';

export function createContext(opts: FetchCreateContextFnOptions) {
  return {
    req: opts.req,
  };
}
export type Context = Awaited<ReturnType<typeof createContext>>;
