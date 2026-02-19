import { NextResponse } from "next/server";
import { GetDashboardSummaryUseCase } from "@/application/use-cases/get-dashboard-summary";

// GET /api/dashboard
// Public endpoint to fetch dashboard metrics
export async function GET() {
    try {
        const useCase = new GetDashboardSummaryUseCase();
        const summary = await useCase.execute();
        return NextResponse.json(summary);
    } catch (error) {
        console.error("Error fetching dashboard summary:", error);
        return NextResponse.json({ error: "Failed to fetch dashboard" }, { status: 500 });
    }
}
