import { prisma } from "@/infrastructure/db/prisma";
import { CreateItemSchema } from "@/application/dto/schemas";
import { z } from "zod";

type CreateItemDto = z.infer<typeof CreateItemSchema>;

export class UpsertItemUseCase {
    async execute(data: CreateItemDto, id?: string) {
        if (id) {
            // Update
            // 1. Fetch current status to check for change
            const currentItem = await prisma.item.findUnique({
                where: { id },
                select: { status: true }
            });

            if (currentItem && data.status && currentItem.status !== data.status) {
                // Status Changed -> Create History
                await prisma.statusHistory.create({
                    data: {
                        itemId: id,
                        fromStatus: currentItem.status,
                        toStatus: data.status,
                        changedAt: new Date()
                    }
                });
            }

            return await prisma.item.update({
                where: { id },
                data: {
                    title: data.title,
                    priority: data.priority,
                    tags: data.tags,
                    whatToLearn: data.whatToLearn,
                    whyItMatters: data.whyItMatters,
                    resources: data.resources,
                    status: data.status,
                }
            });
        } else {
            // Create
            const newItem = await prisma.item.create({
                data: {
                    sectionId: data.sectionId,
                    title: data.title,
                    priority: data.priority,
                    tags: data.tags,
                    whatToLearn: data.whatToLearn,
                    whyItMatters: data.whyItMatters,
                    resources: data.resources,
                    status: "NotStarted"
                }
            });

            // Optional: Create initial history entry?
            // Usually "NotStarted" is default, maybe arguably we should add a history entry.
            // But momentum tracks "changes". Initial creation is a change?
            // Let's add it to be safe and show activity.
            await prisma.statusHistory.create({
                data: {
                    itemId: newItem.id,
                    fromStatus: "New",
                    toStatus: "NotStarted",
                    changedAt: new Date()
                }
            });

            return newItem;
        }
    }
}
