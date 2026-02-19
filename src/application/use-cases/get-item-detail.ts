import { IItemRepository } from "@/application/ports/repositories";
import { PrismaItemRepository } from "@/infrastructure/repositories/item-repository";

// Use Case: Get Item Detail with all relations
// Used by: /api/items/:id page

export class GetItemDetailUseCase {
    private itemRepo: IItemRepository;

    constructor(itemRepo: IItemRepository = new PrismaItemRepository()) {
        this.itemRepo = itemRepo;
    }

    async execute(itemId: string) {
        const item = await this.itemRepo.findByIdWithDetails(itemId);
        if (!item) throw new Error("Item not found");
        return item;
    }
}
