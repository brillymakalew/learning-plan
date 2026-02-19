
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';

const prisma = new PrismaClient();

async function main() {
    console.log("Flat Audit for P0-P2...");

    const phases = await prisma.phase.findMany({
        where: { order: { lte: 2 } }
    });

    const phaseIds = phases.map(p => p.id);
    const phaseMap = new Map(phases.map(p => [p.id, p]));

    const sections = await prisma.section.findMany({
        where: { phaseId: { in: phaseIds } }
    });

    const sectionIds = sections.map(s => s.id);
    const sectionMap = new Map(sections.map(s => [s.id, s]));

    const items = await prisma.item.findMany({
        where: { sectionId: { in: sectionIds } }
    });

    let output = "Missing Resources Report (Flat Audit):\n\n";
    let count = 0;

    for (const item of items) {
        const res = item.resources as any[];
        // Reconstruct hierarchy for report
        const section = sectionMap.get(item.sectionId);
        const phase = phaseMap.get(section?.phaseId || "");

        if (phase && (!res || res.length === 0)) {
            output += `[P${phase.order}: ${item.title}]\n`;
            count++;
        }
    }

    output += `\nTotal Missing in P0-P2: ${count}\n`;
    fs.writeFileSync('missing_resources.txt', output);
    console.log(`Done. Found ${count} missing.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
