export const getRoleFromUser = (user: {
  app_metadata?: Record<string, unknown> | null;
  user_metadata?: Record<string, unknown> | null;
}): string => {
  const appRole = user.app_metadata?.role;
  if (typeof appRole === "string") return appRole;

  const userRole = user.user_metadata?.role;
  if (typeof userRole === "string") return userRole;

  return "user";
};

export const helpers = {
  getRoleFromUser,
};

