
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("Starting resource cleanup...");

    // Get all items
    const items = await prisma.item.findMany();
    let updatedCount = 0;
    let removedCount = 0;

    for (const item of items) {
        const currentResources = (item.resources as any[]) || [];

        // Filter: Keep only if URL starts with http
        const validResources = currentResources.filter((r: any) =>
            r.url && (r.url.startsWith("http://") || r.url.startsWith("https://"))
        );

        if (validResources.length !== currentResources.length) {
            const diff = currentResources.length - validResources.length;
            removedCount += diff;

            await prisma.item.update({
                where: { id: item.id },
                data: { resources: validResources }
            });
            console.log(`Cleaned "${item.title}": Removed ${diff} invalid resources.`);
            updatedCount++;
        }
    }

    console.log(`Finished. Updated ${updatedCount} items. Removed ${removedCount} invalid resources total.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
