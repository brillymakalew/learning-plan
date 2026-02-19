import * as fs from 'fs';
// @ts-ignore
import { INITIAL_ROADMAP } from '../prisma/seed-data';

// Helper to deep copy/modify
const roadmap = JSON.parse(JSON.stringify(INITIAL_ROADMAP));

console.log("Renumbering phases...");

// Sort by current P-number just in case, though they should be in order
// We assume phases are already sorted by orderIndex conceptually in the array

let expectedIndex = 0;

roadmap.phases.forEach((phase, index) => {
    // Check if title starts with P<number>
    const match = phase.title.match(/^P(\d+)\s+[–-]\s+(.*)$/);

    if (match) {
        const currentNum = parseInt(match[1]);
        const restOfTitle = match[2];

        if (currentNum !== expectedIndex) {
            const newTitle = `P${expectedIndex} – ${restOfTitle}`;
            console.log(`Renaming "${phase.title}" -> "${newTitle}"`);
            phase.title = newTitle;
        }
    } else {
        // If it doesn't match P-number pattern, we might want to assign one or skip?
        // User's Excel had strictly P0, P1...
        // My P0 rename was "P0 – Mindset Shift:..." so it matches.
        console.log(`Skipping non-standard title (or already correct): ${phase.title}`);
        // If it's P0, expectedIndex should stay 0 -> 1.
    }

    // Increment expected index for next phase
    expectedIndex++;
});

// Write back
const output = `export const INITIAL_ROADMAP = ${JSON.stringify(roadmap, null, 4)};`;
fs.writeFileSync('prisma/seed-data.ts', output);
console.log("Updated prisma/seed-data.ts");
