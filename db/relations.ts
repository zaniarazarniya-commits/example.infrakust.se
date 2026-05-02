import { relations } from "drizzle-orm";
import { rooms, bookings, favorites, reviews } from "./schema";

export const roomsRelations = relations(rooms, ({ many }) => ({
  bookings: many(bookings),
  favorites: many(favorites),
  reviews: many(reviews),
}));

export const bookingsRelations = relations(bookings, ({ one }) => ({
  room: one(rooms, { fields: [bookings.roomId], references: [rooms.id] }),
}));

export const favoritesRelations = relations(favorites, ({ one }) => ({
  room: one(rooms, { fields: [favorites.roomId], references: [rooms.id] }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  room: one(rooms, { fields: [reviews.roomId], references: [rooms.id] }),
}));
