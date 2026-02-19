import { NextRequest, NextResponse } from "next/server";
import { ensureOwner } from "@/app/api/auth-check";
import { prisma } from "@/infrastructure/db/prisma";

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const authError = await ensureOwner();
    if (authError) return authError;

    try {
        const { id } = await params;
        await prisma.statusHistory.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete history item" }, { status: 500 });
    }
}
