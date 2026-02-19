"use client";

import React from "react";
import { Search, Filter, SortAsc } from "lucide-react";

interface FilterBarProps {
    onSearch: (query: string) => void;
    // We can add more filter props later
}

export function RoadmapFilterBar({ onSearch }: FilterBarProps) {
    return (
        <div className="sticky top-16 z-40 bg-surface/95 backdrop-blur border-b border-surface-border py-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">

                {/* Search */}
                <div className="relative w-full sm:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search items, tags..."
                        className="input-base pl-10 bg-surface-card/50 focus:bg-surface-card"
                        onChange={(e) => onSearch(e.target.value)}
                    />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button className="btn-ghost text-slate-400">
                        <Filter size={18} />
                        filters
                    </button>
                    <button className="btn-ghost text-slate-400">
                        <SortAsc size={18} />
                        sort
                    </button>
                </div>
            </div>
        </div>
    );
}
