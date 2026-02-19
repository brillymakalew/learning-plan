import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        console.log("Connecting...");
        await prisma.roadmap.deleteMany({});
        console.log("Deleted old data.");
        const roadmap = await prisma.roadmap.create({
            data: { title: "Test Roadmap", description: "Created by test script" }
        });
        console.log("Created:", roadmap);
    } catch (e) {
        console.error("Error:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
