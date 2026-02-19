import { NextRequest, NextResponse } from "next/server";
import { ensureOwner } from "@/app/api/auth-check";
import { prisma } from "@/infrastructure/db/prisma";

// DELETE /api/items/[id]
// Implements "Soft Delete" / Archive per PRD §10.3
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const authError = await ensureOwner();
    if (authError) return authError;

    try {
        const { id } = await params;

        await prisma.item.update({
            where: { id },
            data: { status: "Archived" }
        });

        return NextResponse.json({ success: true, message: "Item archived" });
    } catch (error) {
        console.error("Error archiving item:", error);
        return NextResponse.json({ error: "Failed to archive item" }, { status: 500 });
    }
}
