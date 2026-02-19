import { PrismaClient } from '@prisma/client';
import { INITIAL_ROADMAP } from './seed-data';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting seed...');

    // 1. Create Roadmap
    const roadmap = await prisma.roadmap.create({
        data: {
            title: INITIAL_ROADMAP.title,
            description: INITIAL_ROADMAP.description,
            profileSettings: {
                create: {
                    headline: "Transitioning from CS to Org Studies",
                    about: "My journey to becoming a management scholar.",
                }
            }
        }
    });

    console.log(`Created Roadmap: ${roadmap.title}`);

    // 2. Create Phases, Sections, and Items
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
                        whatToLearn: itemData.whatToLearn,
                        whyItMatters: itemData.whyItMatters,
                        resources: itemData.resources,
                        status: "NotStarted"
                    }
                });
                console.log(`      Created Item: ${itemData.title}`);
            }
        }
    }

    console.log('✅ Seed complete!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
