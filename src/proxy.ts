import { envVariables } from "./lib/env";
import jwt, { JwtPayload } from "jsonwebtoken";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  getDefaultDashboardRoute,
  getRouteOwner,
  isAuthRoute,
  UserRole,
} from "./lib/auth-utils";
import { deleteCookie, getCookie } from "./services/auth/tokenHandlers";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const accessToken = (await getCookie("accessToken")) || null;

  let userRole: UserRole | null = null;

  if (accessToken) {
    try {
      const verifiedToken: JwtPayload | string = jwt.verify(
        accessToken,
        envVariables.JWT_SECRET as string
      );

      // Handle edge case where token is a string (invalid)
      if (typeof verifiedToken === "string") {
        throw new Error("Invalid token format");
      }

      userRole = verifiedToken.role;
    } catch (error) {
      // Token is expired or invalid: Clean up cookies and redirect to login
      await deleteCookie("accessToken");
      await deleteCookie("refreshToken");
      if (process.env.NODE_ENV === "development") {
        console.log(error);
      }
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  const routerOwner = getRouteOwner(pathname);
  const isAuth = isAuthRoute(pathname);

  // Rule 1: Logged in user trying to access auth pages (login/signup)
  if (accessToken && isAuth && userRole) {
    return NextResponse.redirect(
      new URL(getDefaultDashboardRoute(userRole as UserRole), request.url)
    );
  }

  // Rule 2: Open public routes
  if (routerOwner === null) {
    return NextResponse.next();
  }

  // If no valid token/role found for protected routes
  if (!accessToken || !userRole) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Rule 3: Common protected routes
  if (routerOwner === "COMMON") {
    return NextResponse.next();
  }

  // Rule 4: Role-based protected routes
  if (
    routerOwner === "ADMIN" ||
    routerOwner === "GUIDE" ||
    routerOwner === "TOURIST"
  ) {
    // Allow SUPER_ADMIN to access ADMIN routes
    if (
      userRole !== routerOwner &&
      !(routerOwner === "ADMIN" && userRole === "SUPER_ADMIN")
    ) {
      return NextResponse.redirect(
        new URL(getDefaultDashboardRoute(userRole as UserRole), request.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.well-known).*)",
  ],
};
