import * as fs from 'fs';
// @ts-ignore
import { INITIAL_ROADMAP } from '../prisma/seed-data';

// Helper to deep copy/modify
const roadmap = JSON.parse(JSON.stringify(INITIAL_ROADMAP));

const p0Index = roadmap.phases.findIndex(p => p.title.startsWith("P0"));
const p1Index = roadmap.phases.findIndex(p => p.title.startsWith("P1"));

if (p0Index !== -1 && p1Index !== -1) {
    console.log("Found P0 and P1. Merging...");

    const p0 = roadmap.phases[p0Index];
    const p1 = roadmap.phases[p1Index];

    // Update P0 Metadata
    p0.title = "P0 – Mindset Shift: CS to Management Scholar";
    p0.description = "Transitioning from 'building' to 'theorizing'. Establishing the philosophical and methodological bedrock for your PhD.";

    // Merge Sections: P1 (Foundations) should come FIRST in P0
    p0.sections = [...p1.sections, ...p0.sections];

    // Remove P1
    roadmap.phases.splice(p1Index, 1);

    console.log("Merged Phase 1 into Phase 0.");
} else {
    console.error("Could not find P0 or P1 to merge.");
}

// Write back
const output = `export const INITIAL_ROADMAP = ${JSON.stringify(roadmap, null, 4)};`;
fs.writeFileSync('prisma/seed-data.ts', output);
console.log("Updated prisma/seed-data.ts");
