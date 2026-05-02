import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { favorites } from "@db/schema";
import { eq, and } from "drizzle-orm";

export const favoriteRouter = createRouter({
  list: publicQuery.query(async ({ ctx }) => {
    if (!ctx.unifiedUser) return [];
    const db = getDb();
    return db
      .select()
      .from(favorites)
      .where(
        and(
          eq(favorites.userId, ctx.unifiedUser.id),
          eq(favorites.userType, ctx.unifiedUser.authType)
        )
      );
  }),

  toggle: publicQuery
    .input(z.object({ roomId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.unifiedUser) throw new Error("Authentication required");
      const db = getDb();

      const existing = await db
        .select()
        .from(favorites)
        .where(
          and(
            eq(favorites.userId, ctx.unifiedUser.id),
            eq(favorites.userType, ctx.unifiedUser.authType),
            eq(favorites.roomId, input.roomId)
          )
        )
        .limit(1);

      if (existing.length > 0) {
        await db.delete(favorites).where(eq(favorites.id, existing[0].id));
        return { favorited: false };
      }

      await db.insert(favorites).values({
        userId: ctx.unifiedUser.id,
        userType: ctx.unifiedUser.authType,
        roomId: input.roomId,
      });
      return { favorited: true };
    }),

  check: publicQuery
    .input(z.object({ roomId: z.number() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.unifiedUser) return { favorited: false };
      const db = getDb();
      const existing = await db
        .select()
        .from(favorites)
        .where(
          and(
            eq(favorites.userId, ctx.unifiedUser.id),
            eq(favorites.userType, ctx.unifiedUser.authType),
            eq(favorites.roomId, input.roomId)
          )
        )
        .limit(1);
      return { favorited: existing.length > 0 };
    }),
});
