import { PrismaClient } from '@prisma/client';
import { INITIAL_ROADMAP } from './seed-data';

const prisma = new PrismaClient();

async function main() {
    console.log('🧹 Cleaning database (Manual Order)...');

    // Delete items dependent on Items first
    await prisma.statusHistory.deleteMany({});
    await prisma.evidence.deleteMany({});
    await prisma.deliverable.deleteMany({});

    // Delete Items
    await prisma.item.deleteMany({});

    // Delete Sections
    await prisma.section.deleteMany({});

    // Delete Phases
    await prisma.phase.deleteMany({});

    // Delete ProfileSettings
    // Note: ProfileSettings might not exist on prisma client if types are old, but it should be fine as it's optional relation
    // If it fails, I'll wrap in try/catch or assume cascade handles it
    try {
        // @ts-ignore
        if (prisma.profileSettings) await prisma.profileSettings.deleteMany({});
    } catch (e) { console.log("Skipped profileSettings delete"); }

    // Delete Roadmap
    await prisma.roadmap.deleteMany({});

    console.log('✨ Database clean.');

    console.log('🌱 Starting fresh seed...');

    // 1. Create Roadmap
    const roadmap = await prisma.roadmap.create({
        data: {
            title: INITIAL_ROADMAP.title,
            description: INITIAL_ROADMAP.description,
            // Omit profileSettings to be safe against schema mismatch
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

    console.log('✅ Fresh seed complete!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
