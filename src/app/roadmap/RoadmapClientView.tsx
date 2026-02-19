"use client";

import React, { useState, useMemo } from "react";
import { RoadmapFilterBar } from "@/ui/components/roadmap/FilterBar";
import { RoadmapItemRow } from "@/ui/components/roadmap/ItemRow";
import { FolderOpen, Plus } from "lucide-react";
import { Modal } from "@/ui/components/Modal";
import { EditItemForm } from "@/ui/components/roadmap/EditItemForm";
import { useRouter } from "next/navigation";

interface RoadmapClientViewProps {
    roadmap: any;
    isOwner: boolean;
}

export function RoadmapClientView({ roadmap, isOwner }: RoadmapClientViewProps) {
    const [query, setQuery] = useState("");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedSectionId, setSelectedSectionId] = useState<string | undefined>(undefined);
    const router = useRouter();

    const handleAddItem = (sectionId?: string) => {
        setSelectedSectionId(sectionId);
        setIsAddModalOpen(true);
    };

    const handleCreateItem = async (data: any) => {
        try {
            const res = await fetch('/api/items', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!res.ok) throw new Error('Failed to create item');

            setIsAddModalOpen(false);
            router.refresh();
        } catch (e) {
            console.error(e);
            alert("Failed to create item");
        }
    };

    const filteredRoadmap = useMemo(() => {
        if (!query) return roadmap;
        const lowerQuery = query.toLowerCase();

        // Deep filter
        const newPhases = roadmap.phases.map((phase: any) => {
            const newSections = phase.sections.map((section: any) => {
                const newItems = section.items.filter((item: any) => {
                    return (
                        item.title.toLowerCase().includes(lowerQuery) ||
                        item.tags.some((t: string) => t.toLowerCase().includes(lowerQuery))
                    );
                });
                return { ...section, items: newItems };
            }).filter((s: any) => s.items.length > 0);

            return { ...phase, sections: newSections };
        }).filter((p: any) => p.sections.length > 0);

        return { ...roadmap, phases: newPhases };
    }, [roadmap, query]);

    return (
        <>
            <div className="flex justify-between items-end mb-6">
                <RoadmapFilterBar onSearch={setQuery} />
                {/* Global Add Item removed in favor of contextual */}
            </div>

            <div className="space-y-12 pb-20">
                {filteredRoadmap.phases.map((phase: any) => (
                    <div key={phase.id} id={`phase-${phase.id}`} className="scroll-mt-24">
                        <div className="flex items-baseline gap-4 mb-6 sticky top-[80px] z-30 py-2 bg-surface/90 backdrop-blur-sm">
                            <h2 className="text-2xl font-bold text-white">{phase.title}</h2>
                            <span className="text-sm text-slate-500 font-mono tracking-tight">Phase {phase.orderIndex + 1}</span>
                        </div>

                        <div className="space-y-8 pl-4 border-l border-surface-border ml-2">
                            {phase.sections.map((section: any) => (
                                <div key={section.id}>
                                    <div className="flex items-center justify-between mb-4 group/header">
                                        <h3 className="text-sm font-semibold uppercase tracking-wider text-brand-400 flex items-center gap-2">
                                            <FolderOpen size={14} />
                                            {section.title}
                                        </h3>
                                        {isOwner && (
                                            <button
                                                onClick={() => handleAddItem(section.id)}
                                                className="text-xs text-slate-500 hover:text-brand-400 opacity-0 group-hover/header:opacity-100 transition flex items-center gap-1"
                                            >
                                                <Plus size={12} /> Add to Section
                                            </button>
                                        )}
                                    </div>

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

            {isOwner && (
                <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Item">
                    <EditItemForm
                        sectionId={selectedSectionId}
                        onSubmit={handleCreateItem}
                        onCancel={() => setIsAddModalOpen(false)}
                    />
                </Modal>
            )}
        </>
    );
}
