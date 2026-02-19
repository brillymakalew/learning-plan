import { NextResponse } from "next/server";
import { GetRoadmapTreeUseCase } from "@/application/use-cases/get-roadmap-tree";

// GET /api/roadmap
// Public endpoint to fetch the entire roadmap tree
export async function GET() {
    try {
        const useCase = new GetRoadmapTreeUseCase();
        const tree = await useCase.execute();
        return NextResponse.json(tree);
    } catch (error) {
        console.error("Error fetching roadmap:", error);
        return NextResponse.json({ error: "Failed to fetch roadmap" }, { status: 500 });
    }
}
