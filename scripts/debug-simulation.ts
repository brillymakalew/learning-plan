
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("Debugging P0 Simulation...");

    const p0 = await prisma.phase.findFirst({
        where: { orderIndex: 0 },
        include: { sections: { include: { items: { include: { statusHistory: true, evidence: true } } } } }
    });

    if (!p0) {
        console.log("No Phase 0 found!");
        return;
    }

    console.log(`Phase 0: ${p0.title}`);
    for (const section of p0.sections) {
        console.log(`  Section: ${section.title}`);
        for (const item of section.items) {
            console.log(`    Item: ${item.title}`);
            console.log(`      Status History Count: ${item.statusHistory.length}`);
            console.log(`      Evidence Count: ${item.evidence.length}`);
            console.log(`      Earliest Change: ${item.statusHistory.length > 0 ? item.statusHistory[0].changedAt : 'None'}`);
        }
    }
}

main()
    .finally(async () => {
        await prisma.$disconnect();
    });
