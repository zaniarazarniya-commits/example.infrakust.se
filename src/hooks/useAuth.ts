import { trpc } from "@/providers/trpc";
import { useCallback, useMemo } from "react";

export function useAuth() {
  const utils = trpc.useUtils();

  const {
    data: oauthUser,
    isLoading: oauthLoading,
  } = trpc.auth.me.useQuery(undefined, {
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  const {
    data: localUser,
    isLoading: localLoading,
  } = trpc.localAuth.me.useQuery(undefined, {
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: async () => {
      await utils.invalidate();
    },
  });

  const user = oauthUser
    ? {
        id: oauthUser.id,
        name: oauthUser.name || "User",
        email: oauthUser.email || null,
        avatar: oauthUser.avatar || null,
        role: oauthUser.role,
        authType: "oauth" as const,
      }
    : localUser
    ? {
        id: localUser.id,
        name: localUser.name || localUser.username || "User",
        email: localUser.email || null,
        avatar: null,
        role: localUser.role,
        authType: "local" as const,
      }
    : null;

  const isAdmin = user?.role === "admin";

  const logout = useCallback(() => {
    localStorage.removeItem("local_auth_token");
    logoutMutation.mutate();
    window.location.reload();
  }, [logoutMutation]);

  return useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading: oauthLoading || localLoading,
      isAdmin,
      logout,
      refresh: () => {
        utils.auth.me.invalidate();
        utils.localAuth.me.invalidate();
      },
    }),
    [user, oauthLoading, localLoading, isAdmin, logout, utils]
  );
}
