
import PDFDocument from 'pdfkit';
import * as fs from 'fs';
import * as path from 'path';

const contentMap: Record<string, string> = {
    // 1. Problem Framing
    "Problem_framing": `
TOPIC: Problem Framing & Problematization
SOURCE: Alvesson & Sandberg (2011) - Generating Research Questions Through Problematization

KEY CONCEPTS:
1. The Dominance of Gap-Spotting
   Most management research relies on "gap-spotting" to construct research questions. This involves identifying a shortage of studies in a specific area. While safe, it often leads to incremental contributions that reinforce existing assumptions rather than challenging them.

2. Problematization as an Alternative
   The authors propose "problematization" as a methodology for generating more influential research questions. This involves:
   - Identifying a domain of literature.
   - Identifying the underlying assumptions (in-house, root, or paradigmatic).
   - Evaluating these assumptions.
   - Developing an alternative assumption ground.
   - Considering the audience.

3. Application
   To make a significant theoretical contribution, I must move beyond simply asking "what is missing?" to asking "what is wrong with how we currently think about this?".
`,

    // 2. Gap Spotting
    "Gap_spotting": `
TOPIC: Gap Spotting Typology
SOURCE: Sandberg & Alvesson (2011) - Ways of constructing research questions

KEY CONCEPTS:
1. Confusion Spotting
   Identifying that existing research contains contradictory evidence or explanations. The goal is to resolve the confusion.

2. Neglect Spotting
   Claiming that a specific area, variable, or level of analysis has been overlooked. This is the most common form of gap-spotting.
   - "We know about X in context A, but not in context B."

3. Application Spotting
   Extending a known theory or concept to a new empirical setting.

CRITIQUE:
While necessary for normal science, gap-spotting rarely leads to "interesting" theories (in the sense of Davis, 1971) because it does not challenge the reader's assumptions. It builds cumulatively but conservatively.
`,

    // 3. Selecting Theory
    "Selecting_theory_as_lens": `
TOPIC: The Nature of Theory
SOURCE: Gregor (2006) - The Nature of Theory in Information Systems

KEY CONCEPTS:
Gregor classifies theory into five types based on their primary goal:

1. Theory for Analyzing
   Describes what is. A taxonomy or classification. (e.g., frameworks).

2. Theory for Explaining
   Explains how and why things happen, but does not necessarily predict future outcomes with precision. (Common in case studies).

3. Theory for Predicting
   Predicts what will happen, without necessarily explaining the deep causal mechanism. (Black box models).

4. Theory for Explaining and Predicting (EP)
   The "Grand Theory" ideal. Explains mechanism and predicts outcome.

5. Theory for Design and Action
   Prescriptive theory on how to do something.

APPLICATION:
For my research, I need to be explicit about which type of theory I am building. Am I simply classifying a phenomenon, or am I explaining the causal mechanism?
`,

    // 4. Research Design Literacy
    "Research_design_literacy_level-1": `
TOPIC: Methodological Fit
SOURCE: Edmondson & McManus (2007) - Methodological Fit in Management Field Research

KEY CONCEPTS:
Research design must align with the state of prior theory in the field.

1. Nascent Theory (Low Maturity)
   - Goal: Pattern identification, construct definition.
   - Data: Open-ended, qualitative (interviews, observations).
   - Analysis: Thematic content analysis.

2. Intermediate Theory (Medium Maturity)
   - Goal: Construct validation, relationship testing.
   - Data: Mixed methods (surveys + interviews).
   - Analysis: Exploratory stats, cross-case analysis.

3. Mature Theory (High Maturity)
   - Goal: Formal hypothesis testing.
   - Data: Quantitative, focused.
   - Analysis: Statistical inference.

TAKEAWAY:
Do not force a quantitative design on a nascent topic. Since my area involves X (Context), checking the maturity of existing literature is the first step in design.
`,

    // 5. Evidence Logic
    "Evidence_logic": `
TOPIC: Evidence-Based Management
SOURCE: Rousseau (2006) - Is there such a thing as 'evidence-based management'?

KEY CONCEPTS:
1. Definition
   Translating principles based on best evidence into organizational practice. It moves away from personal preference and unsystematic experience to decision-making based on the best available scientific evidence.

2. The Interface
   Rousseau argues for a closer connection between research (evidence generation) and practice (evidence application).

3. Critical Thinking
   Evidence logic is not just about "data" but about the logic of inference.
   - Are we measuring what we think we are measuring?
   - Is the causal claim supported by the design?
   - Are alternative explanations ruled out?

Valid evidence requires systematic gathering, not just cherry-picking cases that support a bias.
`,

    // 6. Stakeholder Thinking
    "Stakeholder_thinking_&_context_sensitivity": `
TOPIC: The Impact of Context
SOURCE: Johns (2006) - The Essential Impact of Context on Organizational Behavior

KEY CONCEPTS:
Context is often treated as "noise" or control variables in OB research, but it should be central.

1. Omnibus Context
   The broad environment (Who, What, Where, When).

2. Discrete Context
   Specific task, social, and physical variables that influence behavior.

3. Context Effects
   - Context as a Main Effect: Directly drives behavior.
   - Context as a Moderator: Changes the relationship between X and Y.
   - Context as a Mediator: Explains why X leads to Y.

APPLICATION:
In my research design, I must not strip away context to find "universal laws," but explicitly model how the specific context shapes the phenomenon.
`,

    // 7. Structured Writing
    "Structured_writing_&_research_communication": `
TOPIC: Setting the Hook
SOURCE: Grant & Pollock (2011) - Publishing in AMJ: Setting the Hook

KEY CONCEPTS:
The Introduction is the most critical part of a paper. It must answer three questions:

1. Who Cares? (The Hook)
   Why does this topic matter theoretically or practically?

2. What Do We Know? (The Foundation)
   Briefly summarize the current conversation. "Scholars have largely focused on X..."

3. What Don't We Know? (The Gap/Problem)
   "However, we still do not understand Y..."

4. How Will This Study Help? (The Contribution)
   "This study addresses this by..."

Writing is not just reporting results; it is joining a conversation. The structure must invite the reader in and convince them the journey is worth taking.
`
};

async function main() {
    const simulationDir = path.join(process.cwd(), 'public', 'uploads', 'simulation');

    if (!fs.existsSync(simulationDir)) {
        console.log("No simulation directory found.");
        return;
    }

    const files = fs.readdirSync(simulationDir);
    let count = 0;

    for (const file of files) {
        if (!file.endsWith('.pdf')) continue;

        // Extract key from filename
        // Filenames are like "Problem_framing_Summary.pdf" or "Problem_framing_Reading_Notes.pdf"
        // Base keys in contentMap match the start of the filename (mostly).
        // I need to match the longest key.

        let matchedKey = "";
        for (const key of Object.keys(contentMap)) {
            if (file.startsWith(key)) {
                if (key.length > matchedKey.length) {
                    matchedKey = key;
                }
            }
        }

        if (matchedKey) {
            const text = contentMap[matchedKey];
            const filePath = path.join(simulationDir, file);

            // Generate PDF
            const doc = new PDFDocument();
            const stream = fs.createWriteStream(filePath);

            doc.pipe(stream);

            doc.fontSize(16).text(file.replace(/_/g, ' ').replace('.pdf', ''), { underline: true });
            doc.moveDown();
            doc.fontSize(12).text(text);

            doc.end();

            // Wait for stream to finish? doc.end() handles it, but async logic might race.
            // In a simple script, it's usually fine.
            console.log(`Generated content for ${file}`);
            count++;
        } else {
            console.log(`No content found for ${file}, skipping.`);
        }
    }

    console.log(`Updated ${count} PDF files with real content.`);
}

main().catch(console.error);
