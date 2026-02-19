import * as fs from 'fs';
// @ts-ignore
import { INITIAL_ROADMAP } from '../prisma/seed-data';

// Helper to deep copy/modify
const roadmap = JSON.parse(JSON.stringify(INITIAL_ROADMAP));

const rewrites: Record<string, { whyItMatters: string, whatToLearn: string[] }> = {
    // P3 - GenAI & Learning
    "Generative AI in learning": {
        whyItMatters: "I need to look past the hype. My job is to diagnose the 'failure modes' of learning (e.g. atrophied critical thinking) when AI does the heavy lifting.",
        whatToLearn: [
            "Cognitive Offloading: Distinguishing 'scaffolding' (helpful support) from 'offloading' (bypassing the cognitive struggle needed for learning).",
            "The 'Illusion of Competence': Understanding why students feel they 'know' material they generated but didn't process.",
            "Bloom's 2 Sigma Problem vs. AI: Can AI actually deliver personalized tutoring, or just personalized answers?"
        ]
    },
    "Epistemic agency": {
        whyItMatters: "This is the moral heart of my thesis. 'Flashpoint Bridgework' is about reclaiming the right to *know* and *author* one's own work in an age of automation.",
        whatToLearn: [
            "Epistemic Agency Definition: The capacity to adapt the world to fit one's knowledge needs, rather than adapting oneself to the tool.",
            "Intellectual Virtues: Honesty, curiosity, humility. How does the 'click-to-generate' loop erode these?",
            "Authorial Intent: Who is the author? The prompter, the model, or the engineer? Legal vs. Epistemic authorship."
        ]
    },
    "Authentic assessment": {
        whyItMatters: "I'm not just critiquing; I'm studying solutions. I need to understand what 'good' assessment looks like so I can recognize it when I see it in my cases.",
        whatToLearn: [
            "Authentic Assessment (Wiggins): Tasks that replicate real-world challenges, not just memory tests.",
            "Process-Oriented Assessment: Grading the *drafting* and *thinking* stages, not just the final artifact.",
            "Interactive Orals: The return of the viva voce as a defense against ghostwriting."
        ]
    },
    "Academic integrity & detection": {
        whyItMatters: "I must avoid the 'cop vs. robber' trap. I need to analyze detection not as 'security', but as a 'surveillance infrastructure' that changes trust.",
        whatToLearn: [
            "The False Positive Paradox: Statistical inevitability of accusing innocent students.",
            "The 'Chilling Effect': How surveillance alters student behavior (risk aversion, generic writing).",
            "Trust Theory: Interpersonal trust vs. System trust. How AI breaks the pedagogical contract."
        ]
    },

    // P4 - IS/DT Positioning
    "Digital transformation theory": {
        whyItMatters: "My contribution is theoretical. I need to show that standard 'Digital Transformation' models (which love speed) fail to account for 'Legitimacy' (which needs time).",
        whatToLearn: [
            "Sociotechnical Systems (Trist/Emery): You cannot optimize the technical (AI) without optimizing the social (Learning).",
            "Technological Imperative vs. Social Shaping: Does the tool drive change, or do humans shape the tool?",
            "Institutional Work: How actors create, maintain, or disrupt rules to accommodate new tech."
        ]
    },
    "Dynamic capabilities": {
        whyItMatters: "I need to bridge my corporate 'Agile' past with my academic future. Dynamic Capabilities is the academic version of 'Agility', but I must use it precisely.",
        whatToLearn: [
            "Sensing, Seizing, Transforming (Teece): The micro-foundations of agility.",
            "Ordinary vs. Dynamic Capabilities: 'Doing things right' vs. 'Doing the right things'.",
            "Path Dependence: How history constrains future options (why universities can't just 'pivot' like a startup)."
        ]
    },

    // P5 - Qual Methods
    "Process research": {
        whyItMatters: "I am studying 'becoming', not 'being'. I must capture the *movie*, not the *snapshot*. Investigating 'how' things unfold is my methodological edge.",
        whatToLearn: [
            "Langley's Strategies (1999): Narrative, Quantifying, Synthetic, Visual mapping.",
            "Event-Based Coding: Identifying 'critical incidents' or 'breakdowns' (Flashpoints) as analytical units.",
            "Avoiding 'Variance' Language: Don't say 'X increased Y'. Say 'X enabled the emergence of Y through mechanism Z'."
        ]
    },
    "Interviewing multiple": {
        whyItMatters: "Legitimacy is subjective. I need to hear the student's fear, the admin's risk aversion, and the employer's skepticism directly.",
        whatToLearn: [
            "The 'Active' Interview (Holstein & Gubrium): The interview is a construction of reality, not just data extraction.",
            "Laddering Techniques: Asking 'Why is that important to you?' repeatedly to unearth core values.",
            "Triangulation: Comparing what they *say* (Interview) with what they *do* (Observation)."
        ]
    },
    "Observation of classrooms": {
        whyItMatters: "People lie (or forget). Observation allows me to see the 'practice' of AI use—the hesitation, the negotiation, the workaround—that they won't mention in interviews.",
        whatToLearn: [
            "Shadowing: Following an actor (e.g., a student) through their day.",
            "Thick Description (Geertz): describing not just the wink, but the context that makes it a wink.",
            "Fieldnoting: Separating observation (what happened) from interpretation (what I think it means)."
        ]
    },
    "Document & artifact": {
        whyItMatters: "Policies are 'frozen' organizational logic. Analyzing a syllabus or an AI policy reveals what the university *values* and *fears*.",
        whatToLearn: [
            "Materiality analysis: How does the *design* of the LMS constrain action?",
            "Intertextuality: How does this policy reference other documents (e.g., legal code, marketing)?",
            "Discourse Analysis: Looking for power structures hidden in 'bureaucratic' language."
        ]
    },
    "Abductive analysis": {
        whyItMatters: "I am not testing a hypothesis (Deduction) nor just guessing (Induction). I am iterating between data puzzles and theory to find the best explanation.",
        whatToLearn: [
            "Peirce's Abduction: The logic of discovery. Starts with a 'surprising fact'.",
            "Systematic Combining (Dubois & Gadde): Going back and forth between framework, data source, and analysis.",
            "Theoretical Saturation: Knowing when to stop (when new data brings no new insights)."
        ]
    },
    "Temporal data": {
        whyItMatters: "If my theory is about 'time', my data analysis must be temporal. Timelines and sequence maps are not just pretty pictures; they are evidence.",
        whatToLearn: [
            "Sequence Analysis: Looking for patterns in the order of events (e.g., Policy -> Breach -> Panic -> Revision).",
            "Temporal Bracketing: Breaking the process into distinct periods for analysis.",
            "Narrative Networks: Visualizing who talks to whom, and when."
        ]
    },

    // P6 - Quant Methods
    "Longitudinal survey": {
        whyItMatters: "Qual gives me 'Richness', Quant gives me 'Reach'. I need to prove that these legitimacy shifts are happening at scale or over time.",
        whatToLearn: [
            "Panel Design: Tracking the SAME people over time. Crucial for causal inference.",
            "Attrition Bias: Who drops out? Are they the ones who struggle with AI? If so, my results are skewed.",
            "Measurement Invariance: Does 'Trust in AI' mean the same thing in Month 1 vs Month 6?"
        ]
    },
    "Scale development": {
        whyItMatters: "If I measure 'Legitimacy', I can't just ask 'Is it legit?'. I need a rigorous, multi-item scale that stands up to statistical scrutiny.",
        whatToLearn: [
            "Item Response Theory (basics): Understanding item difficulty and discrimination.",
            "EFA vs CFA: Exploratory (finding the structure) vs Confirmatory (testing the structure).",
            "Construct Validity: Convergent (relates to similar things) and Discriminant (distinct from different things)."
        ]
    },
    "Panel / longitudinal regression": {
        whyItMatters: "I need to know what claims I can make. 'Association' is easy; 'Causality' is hard. Panel data brings me closer to causality than cross-sectional.",
        whatToLearn: [
            "Fixed vs Random Effects: Controlling for unobserved heterogeneity (the 'personalality' of the student/university).",
            "Lagged Variables: Using X at time T-1 to predict Y at time T.",
            "Standard Errors: Clustering them by university/classroom to avoid false confidence."
        ]
    },
    "Multilevel data": {
        whyItMatters: "Students live in classrooms, classrooms in universities. If I ignore this nesting, I treat meaningful context as 'error'.",
        whatToLearn: [
            "ICC (Intraclass Correlation Coefficient): How much of the variance is due to the 'group'?",
            "Grand-mean vs. Group-mean centering: Interpreting effects within-group vs. between-group.",
            "Sample Size requirements: 30 groups of 30 is better than 10 groups of 100."
        ]
    },
    "Visualization & reporting": {
        whyItMatters: "A bad chart can kill a good paper. I need to visualize 'change over time' clarity, not just dump SPSS output.",
        whatToLearn: [
            "Tufte’s Principles: Maximizing data-ink ratio.",
            "Interaction Plots: Visualizing 'It depends' (Moderation effects).",
            "APA Style reporting: Exact formatting for p-values, confidence intervals, and effect sizes."
        ]
    },

    // P7 - Integration
    "Qual–quant triangulation": {
        whyItMatters: "My Mixed Methods must be more than 'Qual + Quant'. They must talk to each other. Divergence (when they disagree) is often more interesting than convergence.",
        whatToLearn: [
            "Integration Level: Integration at Design, Methods, or Interpretation?",
            "Joint Displays: Creating a table that juxtaposes quotes with statistics.",
            "Meta-inference: The conclusion drawn from the combination of strands."
        ]
    },
    "Case comparison": {
        whyItMatters: "Why did University A fail and University B succeed? Cross-case analysis moves me from 'description' to 'explanation'.",
        whatToLearn: [
            "Method of Agreement vs. Method of Difference (Mill): Logic for inferring causality from small-N.",
            "Within-Case vs. Cross-Case Analysis: Do the deep dive first, then the comparison.",
            "Replication Logic: Treating each case as a distinct experiment."
        ]
    },

    // P8 - Execution
    "Research ethics": {
        whyItMatters: "I am studying students. They are vulnerable. I must ensure my research does not expose them to academic discipline or privacy risks.",
        whatToLearn: [
            "Informed Consent: More than a checkbox. Ensuring they understand the risks.",
            "Data Minimization: Collecting only what I need.",
            "Power Asymmetry: Recognizing that students might feel coerced to participate."
        ]
    }
};

// Apply updates
roadmap.phases.forEach((phase: any) => {
    phase.sections.forEach((section: any) => {
        section.items.forEach((item: any) => {
            // Find match
            const key = Object.keys(rewrites).find(k => item.title.includes(k) || k.includes(item.title));
            if (key) {
                console.log(`Rewriting: ${item.title}`);
                item.whyItMatters = rewrites[key].whyItMatters;
                item.whatToLearn = rewrites[key].whatToLearn;
            } else {
                // If no exact match, apply a generic scholarly improvement if it seems like a learning item
                // or leave it if it's purely actionable.
                // For now, we leave it to avoid hallucinations, but maybe tweak the "Why" style if it's visible.
            }
        });
    });
});

// Write back
const output = `export const INITIAL_ROADMAP = ${JSON.stringify(roadmap, null, 4)};`;
fs.writeFileSync('prisma/seed-data.ts', output);
console.log("Updated prisma/seed-data.ts with scholarly rewrites.");
