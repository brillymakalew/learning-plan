import { prisma } from "@/infrastructure/db/prisma";
import { IRoadmapRepository } from "@/application/ports/repositories";

export class PrismaRoadmapRepository implements IRoadmapRepository {
    async getTree() {
        return await prisma.roadmap.findFirst({
            include: {
                phases: {
                    orderBy: { orderIndex: 'asc' },
                    include: {
                        sections: {
                            orderBy: { orderIndex: 'asc' },
                            include: {
                                items: {
                                    orderBy: { priority: 'asc' }, // just a default sort, maybe change later
                                }
                            }
                        }
                    }
                }
            }
        });
    }

    async getById(id: string) {
        return await prisma.roadmap.findUnique({ where: { id } });
    }
}
