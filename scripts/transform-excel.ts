import * as fs from 'fs';

const rawData = JSON.parse(fs.readFileSync('excel-dump.json', 'utf-8'));

// Helper to map status
function mapStatus(s) {
    s = s?.toLowerCase().trim();
    if (s === 'done' || s === 'completed') return 'Done';
    if (s === 'in progress') return 'InProgress';
    return 'NotStarted';
}

// Group by Phase -> Area
const roadmap = {
    title: "Brilly PhD Learning Roadmap",
    description: "Generated from Excel.",
    phases: []
};

const phasesMap = new Map();

rawData.forEach(row => {
    const phaseName = row['Phase'] || 'Uncategorized';
    const sectionName = row['Area'] || 'General';

    if (!phasesMap.has(phaseName)) {
        phasesMap.set(phaseName, new Map());
        roadmap.phases.push({
            title: phaseName,
            description: "",
            sectionsMap: phasesMap.get(phaseName)
        });
    }

    const sectionsMap = phasesMap.get(phaseName);
    if (!sectionsMap.has(sectionName)) {
        sectionsMap.set(sectionName, []);
    }

    const items = sectionsMap.get(sectionName);

    // Construct Item
    const item = {
        title: row['Topic'] || 'Untitled',
        priority: row['Priority'] || 'Medium',
        tags: [row['Area'], row['Suggested timing']].filter(Boolean),
        status: mapStatus(row['Status']),
        whatToLearn: [
            row['Action/Deliverable'],
            row['Evidence of completion']
        ].filter(Boolean),
        whyItMatters: row['Why (for your PhD)'] || "",
        resources: row['Key refs/resources'] ? [{ title: row['Key refs/resources'], url: "" }] : []
    };

    items.push(item);
});

// Convert Maps to Arrays for final output
const finalPhases = roadmap.phases.map((p, pIndex) => {
    const sections = [];
    let sIndex = 0;
    for (const [title, items] of p.sectionsMap) {
        sections.push({
            title,
            items
        });
        sIndex++;
    }
    return {
        title: p.title,
        description: p.description,
        sections
    };
});

const output = `export const INITIAL_ROADMAP = ${JSON.stringify({
    title: roadmap.title,
    description: roadmap.description,
    phases: finalPhases
}, null, 4)};`;

fs.writeFileSync('prisma/seed-data.ts', output);
console.log("Updated prisma/seed-data.ts");
