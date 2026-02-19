
import { PrismaClient, ItemStatus } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

const newItems = [
    {
        title: "Problem framing", section: "Problem Logic", resources: [
            { title: "Alvesson & Sandberg (2011) - Generating Research Questions Through Problematization", url: "https://doi.org/10.5465/AMR.2011.59330882" }
        ]
    },
    {
        title: "Gap spotting", section: "Problem Logic", resources: [
            { title: "Sandberg & Alvesson (2011) - Ways of constructing research questions: gap-spotting or problematization?", url: "https://doi.org/10.1177/1350508410372151" }
        ]
    },
    {
        title: "Selecting theory as lens", section: "Research Design", resources: [
            { title: "Gregor (2006) - The Nature of Theory in Information Systems", url: "https://doi.org/10.2307/25148732" }
        ]
    },
    {
        title: "Research design literacy level-1", section: "Research Design", resources: [
            { title: "Edmondson & McManus (2007) - Methodological Fit in Management Field Research", url: "https://doi.org/10.5465/AMR.2007.26586086" }
        ]
    },
    {
        title: "Evidence logic", section: "Research Design", resources: [
            { title: "Rousseau (2006) - Is there such a thing as 'evidence-based management'?", url: "https://doi.org/10.5465/AMR.2006.20208679" }
        ]
    },
    {
        title: "Stakeholder thinking & context sensitivity", section: "Context & Communication", resources: [
            { title: "Johns (2006) - The Essential Impact of Context on Organizational Behavior", url: "https://doi.org/10.5465/AMR.2006.20208682" }
        ]
    },
    {
        title: "Structured writing & research communication", section: "Context & Communication", resources: [
            { title: "Grant & Pollock (2011) - Publishing in AMJ - Part 3: Setting the Hook", url: "https://doi.org/10.5465/amj.2011.64870094" }
        ]
    }
];

async function main() {
    console.log("Starting Roadmap Simulation...");

    const roadmap = await prisma.roadmap.findFirst();
    if (!roadmap) throw new Error("No roadmap found");

    // 1. Shift Phases
    console.log("Shifting phases...");
    // We update in reverse order or use increment carefully
    // Prisma atomic increment works fine.
    await prisma.phase.updateMany({
        where: { roadmapId: roadmap.id },
        data: { orderIndex: { increment: 1 } }
    });

    // 2. Create new Phase 0
    console.log("Creating Phase 0...");
    const p0 = await prisma.phase.create({
        data: {
            roadmapId: roadmap.id,
            title: "Phase 0: Research Foundations & Literacy",
            orderIndex: 0,
            description: "Building the core capabilities to think like a researcher."
        }
    });

    // 3. Create Sections
    const sectionsMap = new Map();
    const uniqueSections = [...new Set(newItems.map(i => i.section))];

    for (let i = 0; i < uniqueSections.length; i++) {
        const title = uniqueSections[i];
        const section = await prisma.section.create({
            data: {
                phaseId: p0.id,
                title: title,
                orderIndex: i
            }
        });
        sectionsMap.set(title, section.id);
    }

    // 4. Create Items and Simulate History
    console.log("Creating items and history...");
    const now = new Date();

    // Helper for dates
    const daysAgo = (days: number) => {
        const d = new Date();
        d.setDate(d.getDate() - days);
        return d;
    };

    let itemIndex = 0;
    for (const itemData of newItems) {
        // Stagger completion dates slightly (between 30 days ago and 2 days ago)
        // Assume linear progress over the month.
        // Item 1 started 30 days ago, finished 28 days ago.
        // Item 7 started 10 days ago, finished 2 days ago.

        // Spread 7 items over 25 days (leaving last 5 days as 'recent done').
        const startDayOffset = 30 - (itemIndex * 3); // 30, 27, 24...
        const endDayOffset = startDayOffset - 2; // Takes 2 days to finish

        const createdAt = daysAgo(startDayOffset);
        const doneAt = daysAgo(endDayOffset);

        const item = await prisma.item.create({
            data: {
                sectionId: sectionsMap.get(itemData.section),
                title: itemData.title,
                priority: "High",
                status: "Done",
                whyItMatters: "Foundational literacy for research.",
                whatToLearn: ["Key concepts", "Application to own research"],
                resources: itemData.resources,
                createdAt: createdAt,
                updatedAt: doneAt,
                doneAt: doneAt,
                tags: ["Research Literacy", "Foundations"]
            }
        });

        // History: NotStarted (Implicit at creation) -> InProgress -> Done

        // 1. Initial (NotStarted)
        await prisma.statusHistory.create({
            data: {
                itemId: item.id,
                fromStatus: "NotStarted",
                toStatus: "NotStarted",
                changedAt: createdAt,
                note: "Initial creation"
            }
        });

        // 2. InProgress (1 day later)
        const inProgressDate = new Date(createdAt);
        inProgressDate.setHours(inProgressDate.getHours() + 24);

        await prisma.statusHistory.create({
            data: {
                itemId: item.id,
                fromStatus: "NotStarted",
                toStatus: "InProgress",
                changedAt: inProgressDate
            }
        });

        // 3. Done
        await prisma.statusHistory.create({
            data: {
                itemId: item.id,
                fromStatus: "InProgress",
                toStatus: "Done",
                changedAt: doneAt
            }
        });

        // Deliverable
        await prisma.deliverable.create({
            data: {
                itemId: item.id,
                title: `${item.title} Summary`,
                type: "One-pager", // Fixed type enum? No, schema says String.
                status: "Done",
                createdAt: inProgressDate,
                updatedAt: doneAt,
                doneAt: doneAt,
                artifactUrl: `/uploads/simulation/${item.title.replace(/\s+/g, '_')}_Summary.pdf`
            }
        });

        // Evidence
        await prisma.evidence.create({
            data: {
                itemId: item.id,
                title: `${item.title} Reading Notes.pdf`,
                type: "note",
                url: `/uploads/simulation/${item.title.replace(/\s+/g, '_')}_Notes.pdf`,
                createdAt: doneAt
            }
        });

        console.log(`Simulated "${item.title}" (Done at ${doneAt.toISOString().split('T')[0]})`);
        itemIndex++;
    }

    // Create dummy files for evidence links to not 404 immediately (optional)
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'simulation');
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    // We can't easily generate real PDFs, but we can create text files with .pdf extension
    // so browser tries to open them (and might show error or text, but better than 404).
    // Or just leave them as 404s since "Simulate" implies it's fake.
    // User asked "create the deliverables along with the evidence as well (in PDFs)".
    // I'll create dummy files.

    newItems.forEach(i => {
        const name = i.title.replace(/\s+/g, '_');
        fs.writeFileSync(path.join(uploadDir, `${name}_Notes.pdf`), `Dummy PDF content for ${i.title}`);
        fs.writeFileSync(path.join(uploadDir, `${name}_Summary.pdf`), `Dummy Deliverable content for ${i.title}`);
    });

    console.log("Simulation complete.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
