import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { rooms } from "@db/schema";
import { eq } from "drizzle-orm";

export const roomRouter = createRouter({
  list: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(rooms);
  }),

  getBySlug: publicQuery
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      const results = await db.select().from(rooms).where(eq(rooms.slug, input.slug)).limit(1);
      return results[0] || null;
    }),

  create: adminQuery
    .input(
      z.object({
        name: z.string().min(1),
        slug: z.string().min(1),
        description: z.string().optional(),
        shortDesc: z.string().optional(),
        pricePerNight: z.number().positive(),
        maxGuests: z.number().int().min(1).default(2),
        imageUrl: z.string().optional(),
        gallery: z.array(z.string()).default([]),
        amenities: z.array(z.string()).default([]),
        isFeatured: z.boolean().default(false),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(rooms).values({
        ...input,
        pricePerNight: input.pricePerNight.toString(),
        gallery: JSON.stringify(input.gallery),
        amenities: JSON.stringify(input.amenities),
      });
      return { id: Number(result[0].insertId) };
    }),

  update: adminQuery
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        slug: z.string().optional(),
        description: z.string().optional(),
        shortDesc: z.string().optional(),
        pricePerNight: z.number().positive().optional(),
        maxGuests: z.number().int().min(1).optional(),
        imageUrl: z.string().optional(),
        gallery: z.array(z.string()).optional(),
        amenities: z.array(z.string()).optional(),
        isFeatured: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      const updateData: Record<string, unknown> = { ...data };
      if (data.pricePerNight) updateData.pricePerNight = data.pricePerNight.toString();
      if (data.gallery) updateData.gallery = JSON.stringify(data.gallery);
      if (data.amenities) updateData.amenities = JSON.stringify(data.amenities);

      await db.update(rooms).set(updateData).where(eq(rooms.id, id));
      return { success: true };
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(rooms).where(eq(rooms.id, input.id));
      return { success: true };
    }),
});
