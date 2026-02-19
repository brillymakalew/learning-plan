import { NextRequest, NextResponse } from "next/server";
import { UpsertDeliverableUseCase } from "@/application/use-cases/upsert-deliverable";
import { ensureOwner } from "@/app/api/auth-check";
import { CreateDeliverableSchema } from "@/application/dto/schemas";

// POST /api/items/[id]/deliverables
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const authError = await ensureOwner();
    if (authError) return authError;

    try {
        const { id } = await params;
        const body = await request.json();

        const validated = CreateDeliverableSchema.parse({ ...body, itemId: id });

        const useCase = new UpsertDeliverableUseCase();
        const result = await useCase.execute(validated);

        return NextResponse.json(result);
    } catch (error) {
        console.error("Error creating deliverable:", error);
        return NextResponse.json({ error: "Failed to create deliverable" }, { status: 500 });
    }
}
