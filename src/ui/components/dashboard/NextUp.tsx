import React from "react";
import { GlassCard } from "@/ui/components/GlassCard";
import { PriorityBadge } from "@/ui/components/PriorityBadge";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface NextUpProps {
    items: {
        id: string;
        title: string;
        priority: string;
        tags: string[];
    }[];
}

export function NextUp({ items }: NextUpProps) {
    return (
        <GlassCard className="">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">Next Up</h3>
                <Link href="/roadmap?filter=next" className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1">
                    View All <ArrowRight size={14} />
                </Link>
            </div>

            {items.length === 0 ? (
                <div className="text-slate-500 text-sm py-4">No items queued. Good job!</div>
            ) : (
                <div className="flex flex-col divide-y divide-surface-border/50">
                    {items.map((item) => (
                        <Link
                            key={item.id}
                            href={`/roadmap/items/${item.id}`}
                            className="group block py-3 hover:bg-surface-muted/20 -mx-4 px-4 transition first:pt-0 last:pb-0"
                        >
                            <div className="flex justify-between items-start mb-1 gap-2">
                                <h4 className="text-sm font-medium text-slate-300 group-hover:text-white line-clamp-1">
                                    {item.title}
                                </h4>
                                <PriorityBadge priority={item.priority} className="scale-75 origin-top-right shrink-0" />
                            </div>
                            <div className="flex gap-2 overflow-hidden items-center">
                                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                                    {item.tags[0]}
                                </span>
                                {item.tags.length > 1 && (
                                    <>
                                        <span className="text-slate-700">•</span>
                                        <span className="text-[10px] text-slate-600 truncate">
                                            {item.tags.slice(1).join(", ")}
                                        </span>
                                    </>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </GlassCard>
    );
}
