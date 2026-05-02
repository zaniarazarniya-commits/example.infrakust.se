import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { reviews } from "@db/schema";
import { eq, desc, and } from "drizzle-orm";

export const reviewRouter = createRouter({
  list: publicQuery
    .input(z.object({ roomId: z.number().optional() }).optional())
    .query(async ({ input }) => {
      const db = getDb();
      if (input?.roomId) {
        return db
          .select()
          .from(reviews)
          .where(and(eq(reviews.roomId, input.roomId), eq(reviews.isApproved, true)))
          .orderBy(desc(reviews.createdAt));
      }
      return db.select().from(reviews).where(eq(reviews.isApproved, true)).orderBy(desc(reviews.createdAt));
    }),

  listPending: adminQuery.query(async () => {
    const db = getDb();
    return db
      .select()
      .from(reviews)
      .where(eq(reviews.isApproved, false))
      .orderBy(desc(reviews.createdAt));
  }),

  create: publicQuery
    .input(
      z.object({
        roomId: z.number().optional(),
        rating: z.number().int().min(1).max(5),
        comment: z.string().min(1),
        userName: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.unifiedUser) throw new Error("Authentication required");
      const db = getDb();
      const result = await db.insert(reviews).values({
        userId: ctx.unifiedUser.id,
        userType: ctx.unifiedUser.authType,
        userName: input.userName,
        roomId: input.roomId || null,
        rating: input.rating,
        comment: input.comment,
      });
      return { id: Number(result[0].insertId) };
    }),

  approve: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.update(reviews).set({ isApproved: true }).where(eq(reviews.id, input.id));
      return { success: true };
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(reviews).where(eq(reviews.id, input.id));
      return { success: true };
    }),
});
