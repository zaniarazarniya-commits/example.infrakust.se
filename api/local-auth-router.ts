import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createRouter, publicQuery } from "./middleware";
import {
  hashPassword,
  verifyPassword,
  createLocalToken,
  verifyLocalToken,
  getLocalUserById,
  getLocalUserByUsername,
  getLocalUserByEmail,
} from "./lib/local-auth";
import { getDb } from "./queries/connection";
import { localUsers } from "@db/schema";

export const localAuthRouter = createRouter({
  register: publicQuery
    .input(
      z.object({
        username: z.string().min(3).max(50),
        email: z.string().email(),
        password: z.string().min(6),
        displayName: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();

      const existingUsername = await getLocalUserByUsername(input.username);
      if (existingUsername) {
        throw new TRPCError({ code: "CONFLICT", message: "Username already exists" });
      }

      const existingEmail = await getLocalUserByEmail(input.email);
      if (existingEmail) {
        throw new TRPCError({ code: "CONFLICT", message: "Email already registered" });
      }

      const passwordHash = await hashPassword(input.password);

      const result = await db.insert(localUsers).values({
        username: input.username,
        email: input.email,
        displayName: input.displayName || input.username,
        passwordHash,
      });

      const userId = Number(result[0].insertId);
      const token = await createLocalToken(userId);

      return { token, userId };
    }),

  login: publicQuery
    .input(
      z.object({
        username: z.string(),
        password: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const user = await getLocalUserByUsername(input.username);
      if (!user) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid username or password" });
      }

      const valid = await verifyPassword(input.password, user.passwordHash);
      if (!valid) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid username or password" });
      }

      const token = await createLocalToken(user.id);
      return { token, userId: user.id };
    }),

  me: publicQuery.query(async ({ ctx }) => {
    const authHeader = ctx.req.headers.get("x-local-auth-token");
    if (!authHeader) {
      return null;
    }

    const payload = await verifyLocalToken(authHeader);
    if (!payload) {
      return null;
    }

    const user = await getLocalUserById(payload.userId);
    if (!user) {
      return null;
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      name: user.displayName || user.username,
      displayName: user.displayName,
      role: user.role,
      authType: "local" as const,
    };
  }),
});
