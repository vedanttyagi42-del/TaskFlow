import { NextResponse } from "next/server";

const publicRoutes = ["/", "/login", "/signup"];
const protectedRoutes = ["/dashboard", "/tasks"];

export function middleware(req) {
  const pathname = req.nextUrl.pathname;
  const token = req.cookies.get("token")?.value;

  const isProtected = protectedRoutes.some(route =>
    pathname.startsWith(route)
  );

  // 1. Not logged in → block protected routes
  if (!token && isProtected) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 2. Logged in → block public routes
  if (token && publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/signup",
    "/dashboard/:path*",
    "/tasks/:path*",
  ],
};
