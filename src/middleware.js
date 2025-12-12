import { NextResponse } from "next/server";

const publicRoutes = ["/", "/login", "/signup"];
const protectedRoutes = ["/dashboard", "/tasks"];

export async function middleware(req) {
  const pathname = req.nextUrl.pathname;

  // call backend /me route to validate auth cookie
  const isProtected = protectedRoutes.some((r) => pathname.startsWith(r));

  let loggedIn = false;

  try {
    const meRes = await fetch("https://taskflowserver-7lnc.onrender.com/me", {
      method: "GET",
      credentials: "include",
      headers: {
        Cookie: req.headers.get("cookie") || ""
      }
    });

    loggedIn = meRes.ok;
  } catch (err) {
    loggedIn = false;
  }

  // 1. protected route but NOT logged in → redirect to login
  if (!loggedIn && isProtected) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 2. public route but logged in → redirect to dashboard
  if (loggedIn && publicRoutes.includes(pathname)) {
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
    "/tasks/:path*"
  ]
};
