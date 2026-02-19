import { OwnerAuth } from "@/infrastructure/auth/owner-auth";
import { NextResponse } from "next/server";

export async function ensureOwner() {
    const isOwner = await OwnerAuth.isOwner();
    if (!isOwner) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return null; // Null means check passed
}
