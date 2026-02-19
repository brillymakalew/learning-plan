import { ItemStatus } from "@/domain/value-objects/enums";

// Domain Service for calculating progress
// PRD §11.2 Requirements:
// - Item completion: status == Done
// - Section completion: Done items / Total items (excluding Archived)
// - Phase completion: Aggregated across sections
// - Roadmap completion: Aggregated across phases

export class ProgressCalculator {

    static calculatePercentage(done: number, total: number): number {
        if (total === 0) return 0;
        return Math.round((done / total) * 100);
    }

    static getSectionProgress(sectionItems: { status: string }[]) {
        const validItems = sectionItems.filter(i => i.status !== ItemStatus.Archived);
        const total = validItems.length;
        const done = validItems.filter(i => i.status === ItemStatus.Done).length;

        return {
            total,
            done,
            percentage: this.calculatePercentage(done, total)
        };
    }

    static getPhaseProgress(phaseSections: { items: { status: string }[] }[]) {
        // Flatten all items in the phase
        const allItems = phaseSections.flatMap(s => s.items);
        return this.getSectionProgress(allItems);
    }

    static getRoadmapProgress(roadmapPhases: { sections: { items: { status: string }[] }[] }[]) {
        const allItems = roadmapPhases.flatMap(p => p.sections.flatMap(s => s.items));
        return this.getSectionProgress(allItems);
    }
}
