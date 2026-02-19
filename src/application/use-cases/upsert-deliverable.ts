import { prisma } from "@/infrastructure/db/prisma";
import { CreateDeliverableSchema } from "@/application/dto/schemas";
import { z } from "zod";

type CreateDeliverableDto = z.infer<typeof CreateDeliverableSchema>;

export class UpsertDeliverableUseCase {
    async execute(data: CreateDeliverableDto, id?: string) {
        if (id) {
            return await prisma.deliverable.update({
                where: { id },
                data: {
                    title: data.title,
                    type: data.type,
                    acceptanceCriteria: data.acceptanceCriteria
                }
            });
        } else {
            return await prisma.deliverable.create({
                data: {
                    itemId: data.itemId,
                    title: data.title,
                    type: data.type,
                    acceptanceCriteria: data.acceptanceCriteria,
                    status: "Pending"
                }
            });
        }
    }
}
