import { Roadmap, Phase, Section, Item } from "@prisma/client";

export interface IRoadmapRepository {
    getTree(): Promise<(Roadmap & { phases: (Phase & { sections: (Section & { items: Item[] })[] })[] }) | null>;
    getById(id: string): Promise<Roadmap | null>;
}

export interface IItemRepository {
    findById(id: string): Promise<Item | null>;
    updateStatus(id: string, status: string): Promise<Item>;
    findByIdWithDetails(id: string): Promise<any>; // todo: type this properly later
}

import { ProfileSettings, Evidence, Deliverable } from "@prisma/client";

export interface IProfileRepository {
    getSettings(): Promise<ProfileSettings | null>;
    updateSettings(data: Partial<ProfileSettings>): Promise<ProfileSettings>;
}

export interface IEvidenceRepository {
    findByItemId(itemId: string): Promise<Evidence[]>;
    create(data: Omit<Evidence, "id" | "createdAt">): Promise<Evidence>;
    delete(id: string): Promise<Evidence>;
}

export interface IDeliverableRepository {
    findByItemId(itemId: string): Promise<Deliverable[]>;
    updateStatus(id: string, status: string): Promise<Deliverable>;
}
