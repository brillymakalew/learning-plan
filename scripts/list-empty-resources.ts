
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("Checking for empty resources in P0, P1, P2...");

    // items where resources is empty array or null (conceptually)
    // Actually we can just fetch ALL items in P0-P2 phases and filter in JS
    // This avoids complex Prisma JSON queries that might be failing?

    // Get phase IDs for order 0, 1, 2
    const phases = await prisma.phase.findMany({
        where: { orderIndex: { lte: 2 } },
        select: { id: true, title: true, orderIndex: true }
    });

    const phaseIds = phases.map(p => p.id);

    // Find sections in these phases
    const sections = await prisma.section.findMany({
        where: { phaseId: { in: phaseIds } },
        select: { id: true, phaseId: true }
    });

    const sectionIds = sections.map(s => s.id);

    // Find items in these sections
    const items = await prisma.item.findMany({
        where: { sectionId: { in: sectionIds } },
        select: { id: true, title: true, resources: true, sectionId: true }
    });

    let emptyCount = 0;

    // Map items back to structure for logging? Or just list them.
    console.log(`Found ${items.length} items in P0-P2.`);

    for (const item of items) {
        const res = item.resources as any[];
        if (!res || res.length === 0) {
            console.log(`[MISSING] ${item.title}`);
            emptyCount++;
        }
    }

    console.log(`\nTotal items with MISSING resources in P0-P2: ${emptyCount}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
