import { prisma } from "@/infrastructure/db/prisma";
import { AddEvidenceSchema } from "@/application/dto/schemas";
import { z } from "zod";

type AddEvidenceDto = z.infer<typeof AddEvidenceSchema>;

export class AddEvidenceUseCase {
    async execute(data: AddEvidenceDto) {
        return await prisma.evidence.create({
            data: {
                itemId: data.itemId,
                title: data.title,
                type: data.type,
                url: data.url,
                description: data.description,
                reviewedBy: data.reviewedBy
            }
        });
    }
}
