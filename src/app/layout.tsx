import type { Metadata } from "next";
import "../ui/styles/globals.css";

export const metadata: Metadata = {
    title: "Brilly's Learning Plan",
    description:
        "A structured learning roadmap tracking Brilly's journey from Computer Science into Management & Organization Studies. Track progress, capabilities, and evidence.",
    icons: {
        icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>⏳</text></svg>',
    },
    keywords: ["learning roadmap", "capability profile", "organization studies", "research methods"],
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="dark">
            <body>{children}</body>
        </html>
    );
}
