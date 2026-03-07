import { router } from './trpc';
import { filesRouter } from './routers/files';
import { terminalRouter } from './routers/terminal';

export const appRouter = router({
  files: filesRouter,
  terminal: terminalRouter,
});

export type AppRouter = typeof appRouter;
