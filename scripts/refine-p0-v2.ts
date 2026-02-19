import * as fs from 'fs';
// @ts-ignore
import { INITIAL_ROADMAP } from '../prisma/seed-data';

// Helper to deep copy/modify
const roadmap = JSON.parse(JSON.stringify(INITIAL_ROADMAP));

const p0Index = roadmap.phases.findIndex(p => p.title.startsWith("P0") || p.title.startsWith("Mindset Shift"));

if (p0Index !== -1) {
    const p0 = roadmap.phases[p0Index];
    console.log(`Processing ${p0.title}...`);

    // 1. Remove "Measurement / DT index" section
    const originalLength = p0.sections.length;
    p0.sections = p0.sections.filter(s => !s.title.includes("Measurement") && !s.title.includes("DT index"));

    if (p0.sections.length < originalLength) {
        console.log("Removed 'Measurement / DT index' section.");
    } else {
        console.log("Did not find 'Measurement' section to remove (maybe already gone?).");
    }

    // 2. Add "Core Vocabularies" item if missing
    // Check if we have a section for it. Maybe "Research foundations" or "The Identity Shift"?
    // Let's ensure "Research foundations" exists or create a "Mindset & Vocabulary" section.

    let vocabSection = p0.sections.find(s => s.title.includes("vocab") || s.title.includes("foundations"));
    if (!vocabSection) {
        vocabSection = { title: "Research foundations", items: [] };
        p0.sections.unshift(vocabSection); // Add to top
    }

    const hasVocabItem = vocabSection.items.some(i => i.title.toLowerCase().includes("vocabulary"));

    if (!hasVocabItem) {
        vocabSection.items.push({
            title: "Core Vocabularies: CS vs Management",
            priority: "High",
            tags: ["Mindset", "Month 0"],
            status: "NotStarted",
            whatToLearn: [
                "Map terms: 'Variable' vs 'Construct', 'System' vs 'Organization', 'Bug' vs 'Anomaly'.",
                "Understand 'Variance' vs 'Process' explanations."
            ],
            whyItMatters: "Language shapes thinking. You must stop speaking 'system builder' and start speaking 'social scientist'.",
            resources: []
        });
        console.log("Added 'Core Vocabularies' item.");
    }
} else {
    console.error("Could not find P0.");
}

// Write back
const output = `export const INITIAL_ROADMAP = ${JSON.stringify(roadmap, null, 4)};`;
fs.writeFileSync('prisma/seed-data.ts', output);
console.log("Updated prisma/seed-data.ts");
