import React from "react";
import MainLayout from "@/ui/components/MainLayout";
import { prisma } from "@/infrastructure/db/prisma";
import { EvidenceGallery } from "@/ui/components/evidence/EvidenceGallery";

// We'll fetch all evidence directly here.
// In a real app, strict UseCase is better, but for read-only gallery, direct prisma is fine for MVP speed.
async function getEvidence() {
    const evidence = await prisma.evidence.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            item: {
                select: { title: true, id: true }
            }
        }
    });
    return evidence.map(e => ({
        ...e,
        description: e.description || ""
    }));
}

export default async function EvidencePage() {
    const data = await getEvidence();

    return (
        <MainLayout>
            <div className="max-w-6xl mx-auto">
                <header className="mb-12 text-center">
                    <h1 className="text-4xl font-bold text-white mb-4">Proof of Work</h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                        A verified collection of projects, certificates, and artifacts.
                    </p>
                </header>

                <EvidenceGallery evidence={data} />
            </div>
        </MainLayout>
    );
}
