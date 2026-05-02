import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { bookings } from "@db/schema";
import { eq, desc, and } from "drizzle-orm";

export const bookingRouter = createRouter({
  list: publicQuery.query(async ({ ctx }) => {
    if (!ctx.unifiedUser) return [];
    const db = getDb();
    return db
      .select()
      .from(bookings)
      .where(
        and(
          eq(bookings.userId, ctx.unifiedUser.id),
          eq(bookings.userType, ctx.unifiedUser.authType)
        )
      )
      .orderBy(desc(bookings.createdAt));
  }),

  listAll: adminQuery.query(async () => {
    const db = getDb();
    return db.select().from(bookings).orderBy(desc(bookings.createdAt));
  }),

  create: publicQuery
    .input(
      z.object({
        roomId: z.number(),
        checkIn: z.string(),
        checkOut: z.string(),
        guests: z.number().int().min(1).default(2),
        totalAmount: z.number().positive(),
        specialRequests: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.unifiedUser) {
        throw new Error("Authentication required");
      }
      const db = getDb();
      const result = await db.insert(bookings).values({
        userId: ctx.unifiedUser.id,
        userType: ctx.unifiedUser.authType,
        roomId: input.roomId,
        checkIn: new Date(input.checkIn) as unknown as never,
        checkOut: new Date(input.checkOut) as unknown as never,
        guests: input.guests,
        totalAmount: input.totalAmount.toString(),
        specialRequests: input.specialRequests,
      } as unknown as typeof bookings.$inferInsert);
      return { id: Number(result[0].insertId) };
    }),

  update: adminQuery
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["pending", "confirmed", "cancelled", "completed"]).optional(),
        paymentStatus: z.enum(["pending", "paid", "refunded"]).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      await db.update(bookings).set(data).where(eq(bookings.id, id));
      return { success: true };
    }),

  cancel: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.unifiedUser) throw new Error("Authentication required");
      const db = getDb();
      await db
        .update(bookings)
        .set({ status: "cancelled" })
        .where(
          and(
            eq(bookings.id, input.id),
            eq(bookings.userId, ctx.unifiedUser.id),
            eq(bookings.userType, ctx.unifiedUser.authType)
          )
        );
      return { success: true };
    }),

  stats: adminQuery.query(async () => {
    const db = getDb();
    const allBookings = await db.select().from(bookings);
    const totalBookings = allBookings.length;
    const totalRevenue = allBookings.reduce((sum, b) => sum + Number(b.totalAmount), 0);
    const confirmedBookings = allBookings.filter((b) => b.status === "confirmed").length;
    const pendingBookings = allBookings.filter((b) => b.status === "pending").length;

    return {
      totalBookings,
      totalRevenue,
      confirmedBookings,
      pendingBookings,
      averageBookingValue: totalBookings > 0 ? totalRevenue / totalBookings : 0,
    };
  }),
});
