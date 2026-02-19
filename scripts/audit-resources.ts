
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';

const prisma = new PrismaClient();

async function main() {
    console.log("Writing missing resources to missing_resources.txt...");

    // Fetch all items with their section and phase
    const items = await prisma.item.findMany({
        include: {
            section: {
                include: {
                    phase: true
                }
            }
        },
        orderBy: {
            section: {
                phase: {
                    orderIndex: 'asc'
                }
            }
        }
    });

    let output = "Missing Resources Report:\n\n";
    let count = 0;

    for (const item of items) {
        const res = item.resources as any[];
        const phaseOrder = item.section.phase.orderIndex;

        // Only care about P0, P1, P2
        if (phaseOrder <= 2) {
            if (!res || res.length === 0) {
                output += `[P${phaseOrder}] ${item.title}\n`;
                count++;
            }
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
