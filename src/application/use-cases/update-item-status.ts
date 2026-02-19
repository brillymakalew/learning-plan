import { IItemRepository } from "@/application/ports/repositories";
import { PrismaItemRepository } from "@/infrastructure/repositories/item-repository";
import { prisma } from "@/infrastructure/db/prisma";

// Use Case: Update Item Status & Log History
// Used by: /api/items/:id/status

export class UpdateItemStatusUseCase {
    private itemRepo: IItemRepository;

    constructor(itemRepo: IItemRepository = new PrismaItemRepository()) {
        this.itemRepo = itemRepo;
    }

    async execute(itemId: string, newStatus: string, note?: string) {
        // 1. Get current item to know 'fromStatus'
        const currentItem = await this.itemRepo.findById(itemId);
        if (!currentItem) throw new Error("Item not found");

        if (currentItem.status === newStatus) {
            return currentItem; // No change needed
        }

        // 2. Transaction: Update Item + Create History
        const result = await prisma.$transaction(async (tx) => {
            // Update Item
            const updatedItem = await tx.item.update({
                where: { id: itemId },
                data: {
                    status: newStatus,
                    doneAt: newStatus === 'Done' ? new Date() : null
                }
            });

            // Log History
            await tx.statusHistory.create({
                data: {
                    itemId,
                    fromStatus: currentItem.status,
                    toStatus: newStatus,
                    note: note || undefined
                }
            });

            return updatedItem;
        });

        return result;
    }
}
