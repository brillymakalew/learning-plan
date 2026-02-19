import { PrismaClient } from '@prisma/client';
import { INITIAL_ROADMAP } from './seed-data';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Ensuring data exists...');

    let roadmap = await prisma.roadmap.findFirst();

    if (!roadmap) {
        console.log("No roadmap found. Creating...");
        roadmap = await prisma.roadmap.create({
            data: {
                title: INITIAL_ROADMAP.title,
                description: INITIAL_ROADMAP.description
            }
        });
        console.log(`Created Roadmap: ${roadmap.title}`);
    } else {
        console.log(`Roadmap exists: ${roadmap.title}`);
        // Update title if it was the test one
        if (roadmap.title === "Test Roadmap") {
            roadmap = await prisma.roadmap.update({
                where: { id: roadmap.id },
                data: {
                    title: INITIAL_ROADMAP.title,
                    description: INITIAL_ROADMAP.description
                }
            });
            console.log("Updated Test Roadmap to Real Roadmap.");
        }
    }

    // Check phases
    const phaseCount = await prisma.phase.count({ where: { roadmapId: roadmap.id } });
    if (phaseCount > 0) {
        console.log(`Roadmap has ${phaseCount} phases. Skipping phase creation.`);
        // Assuming if phases exist, data is there.
        return;
    }

    console.log("Seeding Phases...");
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
            console.log(`    Created Section: ${section.title}`);

            for (const itemData of sectionData.items) {
                await prisma.item.create({
                    data: {
                        sectionId: section.id,
                        title: itemData.title,
                        priority: itemData.priority,
                        tags: itemData.tags,
                        whatToLearn: itemData.whatToLearn, // Json
                        whyItMatters: itemData.whyItMatters,
                        resources: itemData.resources || [], // Json
                        status: "NotStarted"
                    }
                });
                console.log(`      Created Item: ${itemData.title}`);
            }
        }
    }

    console.log('✅ Ensure Seed complete!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
