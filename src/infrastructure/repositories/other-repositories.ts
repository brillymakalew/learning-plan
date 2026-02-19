import { prisma } from "@/infrastructure/db/prisma";
import { IProfileRepository, IEvidenceRepository, IDeliverableRepository } from "@/application/ports/repositories";
import { Evidence, Deliverable, ProfileSettings } from "@prisma/client";

export class PrismaProfileRepository implements IProfileRepository {
    async getSettings() {
        return await prisma.profileSettings.findFirst();
    }

    async updateSettings(data: Partial<ProfileSettings>) {
        // Upsert logic: if no settings exist, create them attached to the first roadmap found
        const firstRoadmap = await prisma.roadmap.findFirst();
        if (!firstRoadmap) throw new Error("No roadmap found to attach settings to");

        // Remove system fields from update data
        const { roadmapId, id, updatedAt, ...updateData } = data;

        return await prisma.profileSettings.upsert({
            where: { roadmapId: firstRoadmap.id },
            create: {
                roadmapId: firstRoadmap.id,
                ...updateData
            } as any, // casting to avoid strict type issues with partial
            update: updateData as any
        });
    }
}

export class PrismaEvidenceRepository implements IEvidenceRepository {
    async findByItemId(itemId: string) {
        return await prisma.evidence.findMany({ where: { itemId } });
    }

    async create(data: Omit<Evidence, "id" | "createdAt">) {
        return await prisma.evidence.create({ data });
    }

    async delete(id: string) {
        return await prisma.evidence.delete({ where: { id } });
    }
}

export class PrismaDeliverableRepository implements IDeliverableRepository {
    async findByItemId(itemId: string) {
        return await prisma.deliverable.findMany({ where: { itemId } });
    }

    async updateStatus(id: string, status: string) {
        return await prisma.deliverable.update({
            where: { id },
            data: { status }
        });
    }
}
