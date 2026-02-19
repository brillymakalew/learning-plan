"use client";

import React, { useState, useMemo } from "react";
import { GlassCard } from "@/ui/components/GlassCard";
import { Search, ExternalLink, Filter } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface EvidenceItem {
    id: string;
    title: string;
    description: string;
    url: string;
    type: string;
    item?: {
        title: string;
        id: string;
    };
}

interface EvidenceGalleryProps {
    evidence: EvidenceItem[];
}

export function EvidenceGallery({ evidence }: EvidenceGalleryProps) {
    const [query, setQuery] = useState("");
    const [filterType, setFilterType] = useState<string | null>(null);

    const types = Array.from(new Set(evidence.map(e => e.type)));

    const filteredEvidence = useMemo(() => {
        return evidence.filter(e => {
            const matchesQuery = e.title.toLowerCase().includes(query.toLowerCase()) ||
                e.description.toLowerCase().includes(query.toLowerCase());
            const matchesType = filterType ? e.type === filterType : true;
            return matchesQuery && matchesType;
        });
    }, [evidence, query, filterType]);

    return (
        <div className="space-y-8">
            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-surface-card/50 p-4 rounded-xl border border-surface-border">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search evidence..."
                        className="input-base pl-10"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1 md:pb-0">
                    <button
                        onClick={() => setFilterType(null)}
                        className={cn(
                            "px-3 py-1.5 rounded-full text-xs font-medium transition whitespace-nowrap",
                            filterType === null ? "bg-brand-500 text-white" : "bg-surface-border text-slate-400 hover:text-white"
                        )}
                    >
                        All
                    </button>
                    {types.map(t => (
                        <button
                            key={t}
                            onClick={() => setFilterType(t)}
                            className={cn(
                                "px-3 py-1.5 rounded-full text-xs font-medium transition whitespace-nowrap capitalize",
                                filterType === t ? "bg-brand-500 text-white" : "bg-surface-border text-slate-400 hover:text-white"
                            )}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvidence.map(e => (
                    <GlassCard key={e.id} className="flex flex-col h-full group hover:border-brand-500/30 transition-all duration-300">
                        <div className="flex-1">
                            <div className="flex justify-between items-start mb-3">
                                <span className="text-[10px] uppercase font-bold tracking-wider text-brand-400 bg-brand-900/20 px-2 py-1 rounded">
                                    {e.type}
                                </span>
                                <a href={e.url} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-brand-300 transition">
                                    <ExternalLink size={16} />
                                </a>
                            </div>

                            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-brand-100 transition">
                                {e.title}
                            </h3>
                            <p className="text-slate-400 text-sm line-clamp-3 mb-4">
                                {e.description}
                            </p>
                        </div>

                        {e.item && (
                            <div className="mt-4 pt-4 border-t border-surface-border">
                                <p className="text-xs text-slate-500 mb-1">Associated Item:</p>
                                <Link href={`/roadmap/items/${e.item.id}`} className="text-sm text-slate-300 hover:text-brand-400 truncate block transition">
                                    {e.item.title}
                                </Link>
                            </div>
                        )}
                    </GlassCard>
                ))}
            </div>

            {filteredEvidence.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-slate-500">No evidence found matching your criteria.</p>
                </div>
            )}
        </div>
    );
}
