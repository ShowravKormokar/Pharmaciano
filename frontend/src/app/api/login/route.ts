// API for login route in the frontend application.

import { NextResponse } from "next/server";

interface LoginRequestBody {
    email: string;
    password: string;
}

export async function POST(req: Request) {
    try {
        const { email, password } = (await req.json()) as LoginRequestBody;

        const validUsers = {
            "admin@pharmacare.com": { password: "admin123", role: "admin" },
            "salesman@pharmacare.com": { password: "salesman123", role: "salesman" },
        } as const;

        const user = validUsers[email as keyof typeof validUsers];

        if (!user || user.password !== password) {
            return NextResponse.json(
                { success: false, message: "Invalid credentials" },
                { status: 401 }
            );
        }

        const token = Buffer.from(
            `${email}:${Date.now()}`
        ).toString("base64"); // demo token — replace with JWT in production

        const res = NextResponse.json({
            success: true,
            message: "Login successful",
            role: user.role,
        });

        res.cookies.set("auth-token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24, // 1 day
        });

        return res;
    } catch (error) {
        console.error("Login API error:", error);
        return NextResponse.json(
            { success: false, message: "Internal Server Error" },
            { status: 500 }
        );
    }
};