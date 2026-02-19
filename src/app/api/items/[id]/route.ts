import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { UpsertItemUseCase } from "@/application/use-cases/upsert-item";
import { ensureOwner } from "@/app/api/auth-check";
import { CreateItemSchema, UpdateItemSchema } from "@/application/dto/schemas";

// PATCH /api/items/[id] (Update)
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const authError = await ensureOwner();
    if (authError) return authError;

    try {
        const { id } = await params;
        const body = await request.json();

        // Use UpdateItemSchema which has no defaults, preserving undefined
        const validated = UpdateItemSchema.parse(body);

        const useCase = new UpsertItemUseCase();
        const result = await useCase.execute(validated as any, id);

        // Revalidate cache
        revalidatePath("/dashboard");
        revalidatePath("/roadmap");
        revalidatePath(`/roadmap/items/${id}`);

        return NextResponse.json(result);
    } catch (error) {
        console.error("Error updating item:", error);
        return NextResponse.json({ error: "Failed to update item" }, { status: 500 });
    }
}
