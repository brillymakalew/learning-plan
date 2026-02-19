import { z } from "zod";
import { ItemStatus, Priority, CapabilityTag } from "@/domain/value-objects/enums";

export const UpdateItemStatusSchema = z.object({
    status: z.nativeEnum(ItemStatus),
    note: z.string().optional(),
});

// Base schema without defaults (for re-use)
const BaseItemSchema = z.object({
    sectionId: z.string().uuid(),
    title: z.string().min(1, "Title is required"),
    priority: z.nativeEnum(Priority),
    status: z.nativeEnum(ItemStatus),
    tags: z.array(z.string()), // Relaxed from nativeEnum to allow existing seed data tags
    whatToLearn: z.array(z.string()),
    whyItMatters: z.string().min(1, "Reason is required"),
    resources: z.array(
        z.object({
            title: z.string(),
            url: z.string().url(),
        })
    ),
});

export const CreateItemSchema = BaseItemSchema.extend({
    priority: BaseItemSchema.shape.priority.default(Priority.Medium),
    status: BaseItemSchema.shape.status.default(ItemStatus.NotStarted),
    tags: BaseItemSchema.shape.tags.default([]),
    whatToLearn: BaseItemSchema.shape.whatToLearn.default([]),
    resources: BaseItemSchema.shape.resources.default([]),
});

// Update schema: all optional, NO defaults (preserves undefined)
export const UpdateItemSchema = BaseItemSchema.partial();

export const CreateDeliverableSchema = z.object({
    itemId: z.string().uuid(),
    title: z.string().min(1),
    type: z.string().min(1),
    acceptanceCriteria: z.array(z.string()).default([]),
});

export const AddEvidenceSchema = z.object({
    itemId: z.string().uuid(),
    title: z.string().min(1),
    type: z.enum(["note", "summary", "memo", "slide", "paper", "repo", "other"]),
    url: z.string().url(),
    description: z.string().optional(),
    reviewedBy: z.string().optional(),
});
