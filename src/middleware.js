import { NextResponse } from "next/server";

// Public pages → accessible without login
const publicRoutes = ["/", "/login", "/signup"];

// Private pages → requires login
const protectedRoutes = ["/dashboard", "/tasks"];

export function middleware(req) {
  const token = req.cookies.get("token")?.value || null;

  const pathname = req.nextUrl.pathname;

  // ⛔ 1. If NOT logged in and trying to access protected route → redirect to /login
  if (!token && protectedRoutes.some((route) => pathname.startsWith(route))) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  // ⛔ 2. If logged in and trying to access /, /login, /signup → redirect to /dashboard
  if (token && publicRoutes.includes(pathname)) {
    const dashboardUrl = new URL("/dashboard", req.url);
    return NextResponse.redirect(dashboardUrl);
  }

  // Allow everything else
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/", 
    "/login",
    "/signup",
    "/dashboard/:path*", 
    "/tasks/:path*"
  ],
};
