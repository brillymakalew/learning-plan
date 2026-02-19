import { NextRequest, NextResponse } from "next/server";
import { UpdateItemStatusUseCase } from "@/application/use-cases/update-item-status";
import { ensureOwner } from "@/app/api/auth-check";
import { UpdateItemStatusSchema } from "@/application/dto/schemas";

// POST /api/items/[id]/status
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const authError = await ensureOwner();
    if (authError) return authError;

    try {
        const { id } = await params;
        const body = await request.json();

        // Validate
        const validated = UpdateItemStatusSchema.parse(body);

        const useCase = new UpdateItemStatusUseCase();
        const result = await useCase.execute(id, validated.status, validated.note);

        return NextResponse.json(result);
    } catch (error) {
        console.error("Error updating status:", error);
        return NextResponse.json({ error: "Failed to update status" }, { status: 500 });
    }
}
