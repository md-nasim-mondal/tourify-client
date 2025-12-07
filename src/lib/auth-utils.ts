export type UserRole = "SUPER_ADMIN" | "ADMIN" | "GUIDE" | "TOURIST";

// exact : ["/my-profile", "settings"]
//   patterns: [/^\/dashboard/, /^\/tourist/], // Routes starting with /dashboard/* /tourist/*
export type RouteConfig = {
  exact: string[];
  patterns: RegExp[];
};

export const authRoutes = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
];

export const commonProtectedRoutes: RouteConfig = {
  exact: [],
  patterns: [/^\/dashboard(?!\/admin|\/guide|\/tourist)/], // /dashboard/* but not /dashboard/admin, /guide, /tourist
};

export const guideProtectedRoutes: RouteConfig = {
  patterns: [/^\/guide/, /^\/dashboard\/guide/], // /guide/* and /dashboard/guide/*
  exact: [],
};

export const adminProtectedRoutes: RouteConfig = {
  patterns: [/^\/admin/, /^\/dashboard\/admin/], // /admin/* and /dashboard/admin/*
  exact: [],
};

export const touristProtectedRoutes: RouteConfig = {
  patterns: [
    /^\/tourist/,
    /^\/dashboard(?=\/tourist|$)/,
    /^\/dashboard\/tourist/,
  ], // /dashboard and /dashboard/tourist/*
  exact: [],
};

export const isAuthRoute = (pathname: string) => {
  return authRoutes.some((route: string) => route === pathname);
};

export const isRouteMatches = (
  pathname: string,
  routes: RouteConfig
): boolean => {
  if (routes.exact.includes(pathname)) {
    return true;
  }
  return routes.patterns.some((pattern: RegExp) => pattern.test(pathname));
  // if pathname === /dashboard/my-appointments => matches /^\/dashboard/ => true
};

export const getRouteOwner = (
  pathname: string
): "SUPER_ADMIN" | "ADMIN" | "GUIDE" | "TOURIST" | "COMMON" | null => {
  if (isRouteMatches(pathname, adminProtectedRoutes)) {
    return "ADMIN";
  }
  if (isRouteMatches(pathname, guideProtectedRoutes)) {
    return "GUIDE";
  }
  if (isRouteMatches(pathname, touristProtectedRoutes)) {
    return "TOURIST";
  }
  if (isRouteMatches(pathname, commonProtectedRoutes)) {
    return "COMMON";
  }
  return null;
};

export const getDefaultDashboardRoute = (role: UserRole): string => {
  if (role === "SUPER_ADMIN") {
    return "/dashboard/admin";
  }
  if (role === "ADMIN") {
    return "/dashboard/admin";
  }
  if (role === "GUIDE") {
    return "/dashboard/guide";
  }
  if (role === "TOURIST") {
    return "/dashboard/tourist";
  }
  return "/";
};

export const isValidRedirectForRole = (
  redirectPath: string,
  role: UserRole
): boolean => {
  const routeOwner = getRouteOwner(redirectPath);

  if (routeOwner === null || routeOwner === "COMMON") {
    return true;
  }

  if (routeOwner === role) {
    return true;
  }

  // Allow SUPER_ADMIN to access ADMIN routes
  if (role === "SUPER_ADMIN" && routeOwner === "ADMIN") {
    return true;
  }

  return false;
};
