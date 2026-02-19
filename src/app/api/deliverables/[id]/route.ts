import { NextRequest, NextResponse } from "next/server";
import { ensureOwner } from "@/app/api/auth-check";
import { prisma } from "@/infrastructure/db/prisma";

// PATCH /api/deliverables/[id]
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const authError = await ensureOwner();
    if (authError) return authError;

    try {
        const { id } = await params;
        const body = await request.json();

        // Simple direct update for now
        const updated = await prisma.deliverable.update({
            where: { id },
            data: {
                title: body.title,
                type: body.type,
                acceptanceCriteria: body.acceptanceCriteria, // Array of strings
                status: body.status, // Pending | Done
                doneAt: body.status === 'Done' ? new Date() : null
            }
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error("Error updating deliverable:", error);
        return NextResponse.json({ error: "Failed to update deliverable" }, { status: 500 });
    }
}

// DELETE /api/deliverables/[id]
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const authError = await ensureOwner();
    if (authError) return authError;

    try {
        const { id } = await params;
        await prisma.deliverable.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete deliverable" }, { status: 500 });
    }
}
