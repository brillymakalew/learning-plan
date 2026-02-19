import { IRoadmapRepository } from "@/application/ports/repositories";
import { PrismaRoadmapRepository } from "@/infrastructure/repositories/roadmap-repository";

// Use Case: Get full roadmap tree
// Used by: /api/roadmap, /roadmap page

export class GetRoadmapTreeUseCase {
    private roadmapRepo: IRoadmapRepository;

    constructor(roadmapRepo: IRoadmapRepository = new PrismaRoadmapRepository()) {
        this.roadmapRepo = roadmapRepo;
    }

    async execute() {
        const tree = await this.roadmapRepo.getTree();
        if (!tree) return null; // Handle gracefully
        return tree;
    }
}
