import { NextResponse } from "next/server";

export async function POST() {
    const res = NextResponse.json({ success: true, message: "Logged out" });
    res.cookies.delete("auth-token");
    return res;
};