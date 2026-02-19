import { NextRequest, NextResponse } from "next/server";
import { OwnerAuth } from "@/infrastructure/auth/owner-auth";
import { rateLimit } from "@/infrastructure/auth/rate-limit";

export async function POST(req: NextRequest) {
    // 1. Rate Limit
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    if (!rateLimit(ip)) {
        return NextResponse.json(
            { error: "Too many attempts. Please try again later." },
            { status: 429 }
        );
    }

    try {
        const body = await req.json();
        const { key } = body;

        // 2. Verify Key
        if (!key || typeof key !== "string") {
            return NextResponse.json(
                { error: "Key is required" },
                { status: 400 }
            );
        }

        const isValid = OwnerAuth.verifyKey(key);

        if (!isValid) {
            return NextResponse.json(
                { error: "Invalid key" },
                { status: 401 }
            );
        }

        // 3. Set Cookie
        await OwnerAuth.setOwnerCookie();

        return NextResponse.json({ success: true, message: "Unlocked owner mode" });
    } catch (error) {
        console.error("Unlock error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
