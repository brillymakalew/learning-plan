import { PrismaClient } from '@prisma/client';
// @ts-ignore
import { INITIAL_ROADMAP } from '../prisma/seed-data';

const prisma = new PrismaClient();

async function main() {
    console.log('🔄 Force updating roadmap data...');

    let roadmap = await prisma.roadmap.findFirst();

    if (!roadmap) {
        console.log("Creating new roadmap...");
        roadmap = await prisma.roadmap.create({
            data: {
                title: INITIAL_ROADMAP.title,
                description: INITIAL_ROADMAP.description
            }
        });
    } else {
        console.log(`Updating existing roadmap: ${roadmap.title}`);
        await prisma.roadmap.update({
            where: { id: roadmap.id },
            data: {
                title: INITIAL_ROADMAP.title,
                description: INITIAL_ROADMAP.description
            }
        });

        // Delete existing phases to replace content
        console.log("Deleting old phases...");
        await prisma.phase.deleteMany({ where: { roadmapId: roadmap.id } });
    }

    console.log("Seeding new content...");
    // Create Phases, Sections, and Items
    for (const [pIndex, phaseData] of INITIAL_ROADMAP.phases.entries()) {
        const phase = await prisma.phase.create({
            data: {
                roadmapId: roadmap.id,
                title: phaseData.title,
                description: phaseData.description,
                orderIndex: pIndex,
            }
        });
        console.log(`  Created Phase: ${phase.title}`);

        for (const [sIndex, sectionData] of phaseData.sections.entries()) {
            const section = await prisma.section.create({
                data: {
                    phaseId: phase.id,
                    title: sectionData.title,
                    orderIndex: sIndex,
                }
            });

            // Items
            if (sectionData.items && sectionData.items.length > 0) {
                await prisma.item.createMany({
                    data: sectionData.items.map(item => ({
                        sectionId: section.id,
                        title: item.title,
                        priority: item.priority,
                        status: item.status,
                        tags: item.tags,
                        whatToLearn: item.whatToLearn, // Json array
                        whyItMatters: item.whyItMatters,
                        resources: item.resources || [], // Json array
                        // createdAt defaults to now
                    }))
                });
                console.log(`    Created ${sectionData.items.length} items in ${section.title}`);
            }
        }
    }

    console.log('✅ Roadmap updated successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
