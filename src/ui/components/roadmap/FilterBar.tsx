"use client";

import React from "react";
import { Search, Filter } from "lucide-react";


interface FilterBarProps {
    onSearch: (query: string) => void;
    filterStatus: string;
    onFilterStatusChange: (status: string) => void;
}

export function RoadmapFilterBar({
    onSearch,
    filterStatus,
    onFilterStatusChange
}: FilterBarProps) {
    return (
        <div className="sticky top-16 z-40 bg-surface/95 backdrop-blur border-b border-surface-border py-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">

                {/* Search */}
                <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search items, tags..."
                        className="input-base pl-10 bg-surface-card/50 focus:bg-surface-card w-full"
                        onChange={(e) => onSearch(e.target.value)}
                    />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    {/* Status Filter */}
                    <div className="relative flex items-center">
                        <Filter size={16} className="absolute left-3 text-slate-500 pointer-events-none" />
                        <select
                            value={filterStatus}
                            onChange={(e) => onFilterStatusChange(e.target.value)}
                            className="input-base pl-9 py-2 text-sm bg-surface-card/50 focus:bg-surface-card min-w-[140px] appearance-none"
                        >
                            <option value="all">All Status</option>
                            <option value="notstarted">Not Started</option>
                            <option value="inprogress">In Progress</option>
                            <option value="blocked">Blocked</option>
                            <option value="done">Done</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
}
