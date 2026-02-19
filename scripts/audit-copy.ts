
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';

const prisma = new PrismaClient();

async function main() {
    console.log("Starting audit copy...");

    // Get all items
    const items = await prisma.item.findMany();
    let emptyCount = 0;
    let output = "";

    // We can't filter by phase easily without include, but we can list ALL empty ones
    // and rely on title keywords or just manual filter.

    for (const item of items) {
        const res = item.resources as any[];
        if (!res || res.length === 0) {
            output += `[EMPTY] ${item.title}\n`;
            emptyCount++;
        }
    }

    console.log(`Finished. Found ${emptyCount} empty items.`);
    fs.writeFileSync('audit_output.txt', output);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
