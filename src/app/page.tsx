import React from "react";
import MainLayout from "@/ui/components/MainLayout";
import { GetDashboardSummaryUseCase } from "@/application/use-cases/get-dashboard-summary";
import { DashboardClientView } from "@/ui/components/dashboard/DashboardClientView";

export default async function DashboardPage() {
    const useCase = new GetDashboardSummaryUseCase();
    const data = await useCase.execute();

    return (
        <MainLayout>
            <DashboardClientView data={data} />
        </MainLayout>
    );
}
