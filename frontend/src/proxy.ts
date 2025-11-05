// The proxy or middleware setup for handling API requests in the frontend application.

import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
    const token = req.cookies.get("auth-token")?.value;

    if (!token) {
        const loginUrl = new URL("/login", req.url);
        loginUrl.searchParams.set("redirect", req.nextUrl.pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*"],
};