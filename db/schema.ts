import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  text,
  timestamp,
  bigint,
  decimal,
  int,
  boolean,
  json,
  date,
} from "drizzle-orm/mysql-core";

// OAuth users (managed by Kimi SDK)
export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

// Local auth users (username/password)
export const localUsers = mysqlTable("local_users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  displayName: varchar("displayName", { length: 255 }),
  passwordHash: varchar("passwordHash", { length: 255 }).notNull(),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// Hotel rooms
export const rooms = mysqlTable("rooms", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  shortDesc: varchar("shortDesc", { length: 500 }),
  pricePerNight: decimal("pricePerNight", { precision: 10, scale: 2 }).notNull(),
  maxGuests: int("maxGuests").default(2),
  imageUrl: varchar("imageUrl", { length: 500 }),
  gallery: json("gallery").default("[]"),
  amenities: json("amenities").default("[]"),
  isFeatured: boolean("isFeatured").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// Bookings
export const bookings = mysqlTable("bookings", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
  userType: mysqlEnum("userType", ["oauth", "local"]).notNull(),
  roomId: bigint("roomId", { mode: "number", unsigned: true }).references(() => rooms.id),
  checkIn: date("checkIn").notNull(),
  checkOut: date("checkOut").notNull(),
  guests: int("guests").default(2),
  totalAmount: decimal("totalAmount", { precision: 10, scale: 2 }).notNull(),
  status: mysqlEnum("status", ["pending", "confirmed", "cancelled", "completed"]).default("pending"),
  specialRequests: text("specialRequests"),
  paymentStatus: mysqlEnum("paymentStatus", ["pending", "paid", "refunded"]).default("pending"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// User favorites
export const favorites = mysqlTable("favorites", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
  userType: mysqlEnum("userType", ["oauth", "local"]).notNull(),
  roomId: bigint("roomId", { mode: "number", unsigned: true }).references(() => rooms.id),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// Reviews
export const reviews = mysqlTable("reviews", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
  userType: mysqlEnum("userType", ["oauth", "local"]).notNull(),
  userName: varchar("userName", { length: 255 }).notNull(),
  roomId: bigint("roomId", { mode: "number", unsigned: true }).references(() => rooms.id),
  rating: int("rating").notNull(),
  comment: text("comment").notNull(),
  isApproved: boolean("isApproved").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// Contact inquiries
export const contacts = mysqlTable("contacts", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  subject: varchar("subject", { length: 255 }),
  message: text("message").notNull(),
  isRead: boolean("isRead").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// Site settings
export const siteSettings = mysqlTable("site_settings", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 255 }).notNull().unique(),
  value: text("value"),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type LocalUser = typeof localUsers.$inferSelect;
export type Room = typeof rooms.$inferSelect;
export type Booking = typeof bookings.$inferSelect;
export type Favorite = typeof favorites.$inferSelect;
export type Review = typeof reviews.$inferSelect;
export type Contact = typeof contacts.$inferSelect;
