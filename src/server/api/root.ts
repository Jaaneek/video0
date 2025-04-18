import { profileRouter } from "@/server/api/routers/profile";
import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { chatsRouter } from "./routers/chats";
import { imageGenRouter } from "./routers/imageGen";
import { tokensRouter } from "./routers/tokens";
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
	chats: chatsRouter,
	profile: profileRouter,
	tokens: tokensRouter,
	imageGen: imageGenRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
