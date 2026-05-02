import { createRouter, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { users, localUsers, bookings, reviews, contacts, rooms } from "@db/schema";
import { desc } from "drizzle-orm";

export const adminRouter = createRouter({
  stats: adminQuery.query(async () => {
    const db = getDb();
    const oauthUsers = await db.select().from(users);
    const localUsersList = await db.select().from(localUsers);
    const allBookings = await db.select().from(bookings);
    const allReviews = await db.select().from(reviews);
    const allContacts = await db.select().from(contacts);
    const allRooms = await db.select().from(rooms);

    const totalRevenue = allBookings.reduce((sum, b) => sum + Number(b.totalAmount), 0);
    const pendingReviews = allReviews.filter((r) => !r.isApproved).length;
    const unreadContacts = allContacts.filter((c) => !c.isRead).length;

    return {
      totalUsers: oauthUsers.length + localUsersList.length,
      totalOAuthUsers: oauthUsers.length,
      totalLocalUsers: localUsersList.length,
      totalBookings: allBookings.length,
      totalRevenue,
      totalReviews: allReviews.length,
      pendingReviews,
      totalContacts: allContacts.length,
      unreadContacts,
      totalRooms: allRooms.length,
      adminCount: oauthUsers.filter((u) => u.role === "admin").length + localUsersList.filter((u) => u.role === "admin").length,
    };
  }),

  recentBookings: adminQuery.query(async () => {
    const db = getDb();
    return db.select().from(bookings).orderBy(desc(bookings.createdAt)).limit(10);
  }),

  recentReviews: adminQuery.query(async () => {
    const db = getDb();
    return db.select().from(reviews).orderBy(desc(reviews.createdAt)).limit(10);
  }),

  userList: adminQuery.query(async () => {
    const db = getDb();
    const oauthUsers = await db.select().from(users);
    const localUsersList = await db.select().from(localUsers);

    const unified = [
      ...oauthUsers.map((u) => ({
        id: u.id,
        name: u.name || "User",
        email: u.email || "",
        role: u.role,
        authType: "oauth" as const,
        createdAt: u.createdAt,
      })),
      ...localUsersList.map((u) => ({
        id: u.id,
        name: u.displayName || u.username,
        email: u.email,
        role: u.role,
        authType: "local" as const,
        createdAt: u.createdAt,
      })),
    ];

    return unified;
  }),
});
