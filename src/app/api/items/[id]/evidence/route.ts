import { NextRequest, NextResponse } from "next/server";
import { AddEvidenceUseCase } from "@/application/use-cases/add-evidence";
import { ensureOwner } from "@/app/api/auth-check";
import { AddEvidenceSchema } from "@/application/dto/schemas";

// POST /api/items/[id]/evidence
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const authError = await ensureOwner();
    if (authError) return authError;

    try {
        const { id } = await params;
        const body = await request.json();

        const validated = AddEvidenceSchema.parse({ ...body, itemId: id });

        const useCase = new AddEvidenceUseCase();
        const result = await useCase.execute(validated);

        return NextResponse.json(result);
    } catch (error) {
        console.error("Error adding evidence:", error);
        return NextResponse.json({ error: "Failed to add evidence" }, { status: 500 });
    }
}
