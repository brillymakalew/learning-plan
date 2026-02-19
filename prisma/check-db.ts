import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const roadmaps = await prisma.roadmap.findMany({
        include: {
            phases: {
                include: {
                    sections: {
                        include: {
                            items: true
                        }
                    }
                }
            }
        }
    });

    console.log(JSON.stringify(roadmaps, null, 2));
}

main()
    .finally(async () => {
        await prisma.$disconnect();
    });
