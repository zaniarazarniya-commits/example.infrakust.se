import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import type { User } from "@db/schema";
import { authenticateRequest } from "./kimi/auth";
import { verifyLocalToken, getLocalUserById } from "./lib/local-auth";

export type UnifiedUser = {
  id: number;
  name: string;
  email: string | null;
  avatar: string | null;
  role: string;
  authType: "oauth" | "local";
};

export type TrpcContext = {
  req: Request;
  resHeaders: Headers;
  user?: User;
  unifiedUser?: UnifiedUser;
};

export async function createContext(
  opts: FetchCreateContextFnOptions,
): Promise<TrpcContext> {
  const ctx: TrpcContext = { req: opts.req, resHeaders: opts.resHeaders };

  // Try OAuth first
  try {
    const oauthUser = await authenticateRequest(opts.req.headers);
    if (oauthUser) {
      ctx.user = oauthUser;
      ctx.unifiedUser = {
        id: oauthUser.id,
        name: oauthUser.name || "User",
        email: oauthUser.email || null,
        avatar: oauthUser.avatar || null,
        role: oauthUser.role,
        authType: "oauth",
      };
      return ctx;
    }
  } catch {
    // OAuth auth failed, try local
  }

  // Try local auth
  try {
    const localToken = opts.req.headers.get("x-local-auth-token");
    if (localToken) {
      const payload = await verifyLocalToken(localToken);
      if (payload) {
        const localUser = await getLocalUserById(payload.userId);
        if (localUser) {
          ctx.unifiedUser = {
            id: localUser.id,
            name: localUser.displayName || localUser.username,
            email: localUser.email,
            avatar: null,
            role: localUser.role,
            authType: "local",
          };
          // Also set ctx.user for backward compatibility
          ctx.user = {
            id: localUser.id,
            unionId: `local_${localUser.id}`,
            name: localUser.displayName || localUser.username,
            email: localUser.email,
            avatar: null,
            role: localUser.role,
            createdAt: localUser.createdAt,
            updatedAt: localUser.createdAt,
            lastSignInAt: localUser.createdAt,
          };
        }
      }
    }
  } catch {
    // Local auth failed
  }

  return ctx;
}
