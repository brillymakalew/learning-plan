import { prisma } from "@/infrastructure/db/prisma";
import { IItemRepository } from "@/application/ports/repositories";

export class PrismaItemRepository implements IItemRepository {
    async findById(id: string) {
        return await prisma.item.findUnique({ where: { id } });
    }

    async findByIdWithDetails(id: string) {
        return await prisma.item.findUnique({
            where: { id },
            include: {
                deliverables: true,
                evidence: true,
                statusHistory: {
                    orderBy: { changedAt: 'desc' }
                }
            }
        });
    }

    async updateStatus(id: string, status: string) {
        return await prisma.item.update({
            where: { id },
            data: { status }
        });
    }
}
