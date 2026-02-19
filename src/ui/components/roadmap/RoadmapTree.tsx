"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, FolderOpen } from "lucide-react";
import { RoadmapItemRow } from "./ItemRow";

// Type definition for the full tree (including phases/sections)
// We'll trust the caller passes correct structure
interface RoadmapTreeProps {
    roadmap: any; // Using any for speed, but ideally strictly typed from GetRoadmapTreeUseCase
}

export function RoadmapTree({ roadmap }: RoadmapTreeProps) {
    const [searchQuery, setSearchQuery] = useState("");
    // Filtering would happen here or in parent
    // For MVP, we pass search down or filter locally. 
    // Let's optimize: Parent (Page) handles fetching, this handles display.
    // Actually, client-side filtering is fast for < 1000 items.

    return (
        <div className="space-y-12">
            {roadmap.phases.map((phase: any) => (
                <div key={phase.id} id={`phase-${phase.id}`} className="scroll-mt-24">
                    <div className="flex items-baseline gap-4 mb-6 sticky top-[80px] z-30 py-2 bg-surface/90 backdrop-blur-sm">
                        <h2 className="text-2xl font-bold text-white">{phase.title}</h2>
                        <span className="text-sm text-slate-500 font-mono tracking-tight">Phase {phase.orderIndex + 1}</span>
                    </div>

                    <div className="space-y-6 pl-4 border-l border-surface-border ml-2">
                        {phase.sections.map((section: any) => (
                            <div key={section.id}>
                                <h3 className="text-sm font-semibold uppercase tracking-wider text-brand-400 mb-4 flex items-center gap-2">
                                    <FolderOpen size={14} />
                                    {section.title}
                                </h3>

                                <div className="space-y-2">
                                    {section.items.map((item: any) => (
                                        <RoadmapItemRow key={item.id} item={item} />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
