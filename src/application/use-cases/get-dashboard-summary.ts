import { prisma } from "@/infrastructure/db/prisma";
import { ProgressCalculator } from "@/domain/services/progress-calculator";

// Use Case: Get Dashboard Metrics
// Used by: /api/dashboard page

export class GetDashboardSummaryUseCase {
    async execute() {
        // 1. Fetch full roadmap structure to calculate progress
        const roadmap = await prisma.roadmap.findFirst({
            include: {
                phases: {
                    orderBy: { orderIndex: 'asc' },
                    include: {
                        sections: {
                            include: {
                                items: {
                                    select: { status: true, priority: true, updatedAt: true, title: true, id: true, tags: true },
                                }
                            }
                        }
                    }
                }
            }
        });

        if (!roadmap) {
            return {
                overallProgress: 0,
                totalItems: 0,
                doneItems: 0,
                currentPhase: null,
                phases: [],
                nextUp: [],
                recentActivity: [],
                momentum: 0
            };
        }

        // 2. Compute Progress Metrics
        const roadmapProgress = ProgressCalculator.getRoadmapProgress(roadmap.phases);

        // 3. Find Current Phase (first phase < 100%)
        let currentPhase = roadmap.phases.find(p => {
            const prog = ProgressCalculator.getPhaseProgress(p.sections as any);
            return prog.percentage < 100;
        });

        // If all done, current is the last one
        if (!currentPhase && roadmap.phases.length > 0) {
            currentPhase = roadmap.phases[roadmap.phases.length - 1];
        }

        const currentPhaseProgress = currentPhase
            ? ProgressCalculator.getPhaseProgress(currentPhase.sections as any)
            : { percentage: 0, total: 0, done: 0 };

        // 4. Next Up Items (NotStarted, sorted by priority)
        // Priority sort order: High > Medium > Low
        const priorityWeight = { "High": 3, "Medium": 2, "Low": 1 };

        const allItems = roadmap.phases.flatMap(p => p.sections.flatMap(s => s.items));
        const nextUp = allItems
            .filter(i => i.status === "NotStarted")
            .sort((a, b) => {
                const weightA = priorityWeight[a.priority as keyof typeof priorityWeight] || 0;
                const weightB = priorityWeight[b.priority as keyof typeof priorityWeight] || 0;
                return weightB - weightA; // Descending
            })
            .slice(0, 3);

        // 5. Calculate Momentum (Active Days)
        // Count unique days with activity (Status Change or Evidence)
        const historyDates = await prisma.statusHistory.findMany({
            select: { changedAt: true }
        });
        const evidenceDates = await prisma.evidence.findMany({
            select: { createdAt: true }
        });

        const uniqueDays = new Set<string>();
        historyDates.forEach(h => uniqueDays.add(h.changedAt.toISOString().split('T')[0]));
        evidenceDates.forEach(e => uniqueDays.add(e.createdAt.toISOString().split('T')[0]));

        const momentumCount = uniqueDays.size;

        // 6. Recently Updated items
        const recentActivity = await prisma.statusHistory.findMany({
            take: 10,
            orderBy: { changedAt: 'desc' },
            include: {
                item: {
                    select: { title: true, id: true }
                }
            }
        });

        return {
            overallProgress: roadmapProgress.percentage,
            totalItems: roadmapProgress.total,
            doneItems: roadmapProgress.done,
            currentPhase: {
                id: currentPhase?.id,
                title: currentPhase?.title,
                progress: currentPhaseProgress.percentage
            },
            phases: roadmap.phases.map(p => ({
                id: p.id,
                title: p.title,
                progress: ProgressCalculator.getPhaseProgress(p.sections as any).percentage
            })),
            nextUp,
            momentum: momentumCount,
            recentActivity
        };
    }
}
