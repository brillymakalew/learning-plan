import React from "react";
import MainLayout from "@/ui/components/MainLayout";
import { GetRoadmapTreeUseCase } from "@/application/use-cases/get-roadmap-tree";
import { RoadmapClientView } from "./RoadmapClientView";
import { OwnerAuth } from "@/infrastructure/auth/owner-auth";

export default async function RoadmapPage() {
    const useCase = new GetRoadmapTreeUseCase();
    const roadmap = await useCase.execute();
    const isOwner = await OwnerAuth.isOwner();

    return (
        <MainLayout>
            <div className="max-w-4xl mx-auto">
                <header className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">My Roadmap</h1>
                            <p className="text-slate-400">The master plan. {roadmap?.phases.length} phases.</p>
                        </div>
                        {/* Pass isOwner to client view to show "Add Item" buttons etc. */}
                    </div>
                </header>

                <RoadmapClientView roadmap={roadmap} isOwner={isOwner} />
            </div>
        </MainLayout>
    );
}
