// The proxy or middleware setup for handling API requests in the frontend application.

import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
    const token = req.cookies.get("auth-token")?.value;
    const { pathname } = req.nextUrl;

    // If token not found → block access to /dashboard
    if (!token && pathname.startsWith("/dashboard")) {
        const loginUrl = new URL("/login", req.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
    }

    // If token found → block access to /login and /register
    if (token && (pathname === "/login" || pathname === "/register")) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/login"],
};