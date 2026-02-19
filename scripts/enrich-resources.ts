
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const resourcesMap: Record<string, { title: string, url: string }[]> = {
    // P4 - Methodology
    "Case study": [
        { title: "Eisenhardt (1989) - Building Theories from Case Study Research", url: "https://doi.org/10.5465/AMR.1989.4308385" },
        { title: "Yin (2018) - Case Study Research and Applications (SAGE)", url: "https://us.sagepub.com/en-us/nam/case-study-research-and-applications/book250150" },
        { title: "Stake (1995) - The Art of Case Study Research", url: "https://us.sagepub.com/en-us/nam/the-art-of-case-study-research/book4782" }
    ],
    "Process research": [
        { title: "Langley (1999) - Strategies for Theorizing from Process Data", url: "https://doi.org/10.5465/AMR.1999.2553248" },
        { title: "Van de Ven (2007) - Engaged Scholarship", url: "https://global.oup.com/academic/product/engaged-scholarship-9780199226306" }
    ],
    "Grounded theory": [
        { title: "Gioia, Corley & Hamilton (2013) - Seeking Qualitative Rigor in Inductive Research", url: "https://doi.org/10.1177/1094428112452151" },
        { title: "Charmaz (2006) - Constructing Grounded Theory", url: "https://us.sagepub.com/en-us/nam/constructing-grounded-theory/book235960" }
    ],
    "Abductive analysis": [
        { title: "Timmermans & Tavory (2012) - Theory Construction in Qualitative Research", url: "https://doi.org/10.1177/0735275112457914" }
    ],
    "Ethnography": [
        { title: "Van Maanen (2011) - Tales of the Field", url: "https://press.uchicago.edu/ucp/books/book/chicago/T/bo11585802.html" },
        { title: "Golden-Biddle & Locke (1993) - Appealing Work: An Investigation of how Ethnographic Texts Convince", url: "https://doi.org/10.1287/orsc.4.4.595" }
    ],
    "Quantitative": [ // Covering survey/regression/scales broadly
        { title: "Podsakoff et al. (2003) - Common Method Biases", url: "https://doi.org/10.1037/0021-9010.88.5.879" },
        { title: "Hinkin (1998) - Brief Tutorial on the Development of Measures", url: "https://doi.org/10.1177/109442819800100106" },
        { title: "Venkatesh et al. (2013) - Bridging the Qualitative-Quantitative Divide", url: "https://doi.org/10.25300/MISQ/2013/37.1.02" }
    ]
};

async function main() {
    console.log("Starting verified resource enrichment (Batch 4 - Methodology)...");

    // Get all items
    const items = await prisma.item.findMany();
    let updatedCount = 0;

    for (const item of items) {
        // Simple string matching
        const key = Object.keys(resourcesMap).find(k => item.title.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(item.title.toLowerCase()));

        if (key) {
            await prisma.item.update({
                where: { id: item.id },
                data: { resources: resourcesMap[key] }
            });
            console.log(`Overwrote resources for "${item.title}" with verified links.`);
            updatedCount++;
        }
    }

    console.log(`Finished. Updated ${updatedCount} Methodology items.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
