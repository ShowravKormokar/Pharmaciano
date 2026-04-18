import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
    const PUBLIC_ROUTES = ["/login", "/register", "/forgot-pass"];
    const DEFAULT_AUTHENTICATED_REDIRECT = "/dashboard";
    const DEFAULT_UNAUTHENTICATED_REDIRECT = "/login";

    const { pathname } = req.nextUrl;
    const token = req.cookies.get("auth-token")?.value;

    const isPublicRoute = PUBLIC_ROUTES.some(
        (route) => pathname === route || pathname.startsWith(`${route}/`)
    );

    // Root path: always redirect based on auth state
    if (pathname === "/") {
        const target = token
            ? DEFAULT_AUTHENTICATED_REDIRECT
            : DEFAULT_UNAUTHENTICATED_REDIRECT;
        return NextResponse.redirect(new URL(target, req.url));
    }

    // Unauthenticated → protected route
    if (!token && !isPublicRoute) {
        const loginUrl = new URL(DEFAULT_UNAUTHENTICATED_REDIRECT, req.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(new URL(loginUrl, req.url));
    }

    // Authenticated → public route (e.g. /login)
    if (token && isPublicRoute) {
        return NextResponse.redirect(
            new URL(DEFAULT_AUTHENTICATED_REDIRECT, req.url)
        );
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?|ttf|otf|eot)$).*)",
    ],
};