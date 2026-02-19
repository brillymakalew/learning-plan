"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, CheckCircle2, Circle, Clock, Info } from "lucide-react";
import { StatusChip } from "@/ui/components/StatusChip";
import { PriorityBadge } from "@/ui/components/PriorityBadge";
import { cn } from "@/lib/utils";

interface ItemRowProps {
    item: {
        id: string;
        title: string;
        status: string;
        priority: string;
        tags: string[];
        whatToLearn?: any[]; // json
    };
}

export function RoadmapItemRow({ item }: ItemRowProps) {
    return (
        <Link
            href={`/roadmap/items/${item.id}`}
            className="group flex items-center gap-4 p-4 rounded-xl border border-transparent hover:border-surface-border hover:bg-surface-card/60 transition-all duration-200"
        >
            {/* 1. Status Icon */}
            <div className={cn(
                "flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                item.status === "Done" ? "border-emerald-500 bg-emerald-500/10 text-emerald-500" :
                    item.status === "InProgress" ? "border-brand-500 text-brand-500" :
                        "border-slate-700 text-slate-700 group-hover:border-slate-500"
            )}>
                {item.status === "Done" && <CheckCircle2 size={14} />}
                {item.status === "InProgress" && <Clock size={14} />}
                {item.status === "NotStarted" && <Circle size={10} fill="currentColor" className="opacity-0 group-hover:opacity-50" />}
            </div>

            {/* 2. Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                    <h4 className={cn(
                        "text-base font-medium truncate transition-colors",
                        item.status === "Done" ? "text-slate-500 line-through" : "text-slate-200 group-hover:text-brand-300"
                    )}>
                        {item.title}
                    </h4>
                    <PriorityBadge priority={item.priority} className="hidden sm:inline-flex" />
                </div>

                {/* Tags & Meta */}
                <div className="flex items-center gap-3 mt-1.5">
                    <StatusChip status={item.status} className="scale-90 origin-left" />

                    <div className="hidden sm:flex items-center gap-2">
                        {item.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="text-[10px] text-slate-500 px-1.5 py-0.5 bg-surface-border/30 rounded">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* 3. Arrow */}
            <ChevronRight size={20} className="text-slate-600 group-hover:text-brand-400 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
        </Link>
    );
}
