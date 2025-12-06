/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

const AuthRoutes = ["/login", "/register"];
const RoleBasedRoutes = {
  SUPER_ADMIN: /^\/dashboard\/admin/,
  ADMIN: /^\/dashboard\/admin/,
  GUIDE: /^\/dashboard\/guide/,
  TOURIST: /^\/dashboard\/tourist/,
};

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;

  // 1. If user is logged in and tries to access Auth routes, redirect to home/dashboard
  if (accessToken && AuthRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 2. If user tries to access Private/Dashboard routes without login
  if (!accessToken && pathname.startsWith("/dashboard")) {
    // Redirect to login with the return url
    return NextResponse.redirect(
      new URL(`/login?redirect=${pathname}`, request.url)
    );
  }

  // 3. Role Based Authorization
  if (accessToken && pathname.startsWith("/dashboard")) {
    let decoded: any;
    try {
      decoded = jwtDecode(accessToken);
    } catch (e) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const role = decoded?.role; // SUPER_ADMIN, ADMIN, GUIDE, TOURIST

    // Check if the route matches the role
    if (role === "SUPER_ADMIN" || role === "ADMIN") {
      // Admins can access admin routes
      if (!RoleBasedRoutes.ADMIN.test(pathname)) {
        return NextResponse.redirect(new URL("/dashboard/admin", request.url));
      }
    } else if (role === "GUIDE") {
      if (!RoleBasedRoutes.GUIDE.test(pathname)) {
        return NextResponse.redirect(new URL("/dashboard/guide", request.url));
      }
    } else if (role === "TOURIST") {
      if (!RoleBasedRoutes.TOURIST.test(pathname)) {
        return NextResponse.redirect(
          new URL("/dashboard/tourist", request.url)
        );
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/register", "/dashboard/:path*"],
};
