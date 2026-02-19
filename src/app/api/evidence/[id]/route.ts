import { NextRequest, NextResponse } from "next/server";
import { ensureOwner } from "@/app/api/auth-check";
import { prisma } from "@/infrastructure/db/prisma";

// DELETE /api/evidence/[id]
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const authError = await ensureOwner();
    if (authError) return authError;

    try {
        const { id } = await params;
        await prisma.evidence.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete evidence" }, { status: 500 });
    }
}

// PATCH /api/evidence/[id]
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const authError = await ensureOwner();
    if (authError) return authError;

    try {
        const { id } = await params;
        const body = await request.json();

        // Update fields
        const updated = await prisma.evidence.update({
            where: { id },
            data: {
                title: body.title,
                type: body.type,
                url: body.url,
                description: body.description,
                reviewedBy: body.reviewedBy
            }
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error("Failed to update evidence:", error);
        return NextResponse.json({ error: "Failed to update evidence" }, { status: 500 });
    }
}
