import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { UpsertItemUseCase } from "@/application/use-cases/upsert-item";
import { ensureOwner } from "@/app/api/auth-check";
import { CreateItemSchema } from "@/application/dto/schemas";

// POST /api/items (Create)
export async function POST(request: NextRequest) {
    const authError = await ensureOwner();
    if (authError) return authError;

    try {
        const body = await request.json();
        const validated = CreateItemSchema.parse(body);

        const useCase = new UpsertItemUseCase();
        const result = await useCase.execute(validated);

        // Revalidate cache
        revalidatePath("/dashboard");
        revalidatePath("/roadmap");

        return NextResponse.json(result);
    } catch (error) {
        console.error("Error creating item:", error);
        return NextResponse.json({ error: "Failed to create item" }, { status: 500 });
    }
}
