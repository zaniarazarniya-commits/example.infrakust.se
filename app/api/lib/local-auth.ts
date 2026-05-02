import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { env } from "./env";
import { getDb } from "../queries/connection";
import { localUsers } from "@db/schema";
import { eq } from "drizzle-orm";

const JWT_SECRET = new TextEncoder().encode(env.appSecret || "local-auth-secret-key");

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createLocalToken(userId: number): Promise<string> {
  return new SignJWT({ userId, type: "local" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(JWT_SECRET);
}

export async function verifyLocalToken(token: string): Promise<{ userId: number } | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, { clockTolerance: 60 });
    if (payload.type === "local" && typeof payload.userId === "number") {
      return { userId: payload.userId };
    }
    return null;
  } catch {
    return null;
  }
}

export async function getLocalUserById(userId: number) {
  const db = getDb();
  const results = await db.select().from(localUsers).where(eq(localUsers.id, userId)).limit(1);
  return results[0] || null;
}

export async function getLocalUserByUsername(username: string) {
  const db = getDb();
  const results = await db.select().from(localUsers).where(eq(localUsers.username, username)).limit(1);
  return results[0] || null;
}

export async function getLocalUserByEmail(email: string) {
  const db = getDb();
  const results = await db.select().from(localUsers).where(eq(localUsers.email, email)).limit(1);
  return results[0] || null;
}
