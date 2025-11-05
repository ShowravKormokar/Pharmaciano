// The proxy or middleware setup for handling API requests in the frontend application.

import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
    const token = req.cookies.get('auth-token')?.value;

    if (!token) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    return NextResponse.next();
};

export const config = {
    matcher: ['/dashboard'],
};