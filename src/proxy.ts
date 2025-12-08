/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { envVariables } from "./lib/env";
import jwt, { JwtPayload } from "jsonwebtoken";
import {
  getDefaultDashboardRoute,
  getRouteOwner,
  isAuthRoute,
  UserRole,
} from "./lib/auth-utils";
import { deleteCookie, getCookie } from "./services/auth/tokenHandlers";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const accessToken = await getCookie("accessToken");

  let userRole: UserRole | null = null;
  let isTokenValid = false;

  // Validate token if exists
  if (accessToken) {
    try {
      const verifiedToken = jwt.verify(
        accessToken,
        envVariables.JWT_SECRET as string
      ) as JwtPayload;

      userRole = verifiedToken.role;
      isTokenValid = true;
    } catch (error: any) {
      // Token is expired or invalid
      if (error.name === "TokenExpiredError") {
        // Try to refresh token
        try {
          const refreshToken = await getCookie("refreshToken");
          if (refreshToken) {
            const refreshResponse = await fetch(
              `${envVariables.BASE_API_URL}/auth/refresh-token`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${refreshToken}`,
                },
              }
            );

            if (refreshResponse.ok) {
              const refreshData = await refreshResponse.json();
              if (refreshData.success && refreshData.data?.accessToken) {
                // Store new token in cookie for subsequent requests
                const response = NextResponse.next();
                response.cookies.set({
                  name: "accessToken",
                  value: refreshData.data.accessToken,
                  httpOnly: true,
                  secure: process.env.NODE_ENV === "production",
                  sameSite: "lax",
                  maxAge: 60 * 60 * 24,
                  path: "/",
                });

                // Decode new token to get role
                const newToken = jwt.verify(
                  refreshData.data.accessToken,
                  envVariables.JWT_SECRET as string
                ) as JwtPayload;
                userRole = newToken.role;
                isTokenValid = true;
              }
            }
          }
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);
        }
      }

      // If refresh failed or token is invalid
      if (!isTokenValid) {
        await deleteCookie("accessToken");
        await deleteCookie("refreshToken");

        if (process.env.NODE_ENV === "development") {
          console.log("Auth error:", error.message);
        }

        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
      }
    }
  }

  const routerOwner = getRouteOwner(pathname);
  const isAuth = isAuthRoute(pathname);

  // Rule 1: Logged in user trying to access auth pages
  if (isTokenValid && isAuth && userRole) {
    return NextResponse.redirect(
      new URL(getDefaultDashboardRoute(userRole), request.url)
    );
  }

  // Rule 2: Open public routes
  if (routerOwner === null) {
    return NextResponse.next();
  }

  // If no valid token/role found for protected routes
  if (!isTokenValid || !userRole) {
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
        new URL(getDefaultDashboardRoute(userRole), request.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:ico|png|jpg|jpeg|gif|webp|svg)$).*)",
  ],
};
