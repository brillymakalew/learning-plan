import React from "react";
import { GlassCard } from "@/ui/components/GlassCard";
import { Activity } from "lucide-react";

interface RecentActivityProps {
    activities: {
        id: string;
        item: { title: string; id: string };
        toStatus: string;
        fromStatus: string;
        changedAt: Date | string;
    }[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
    return (
        <GlassCard>
            <div className="flex items-center gap-2 mb-4">
                <Activity size={18} className="text-brand-400" />
                <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
            </div>

            <div className="relative border-l-2 border-surface-border ml-3 pl-6 space-y-6 pb-2">
                {activities.slice(0, 5).map((activity) => (
                    <div key={activity.id} className="relative">
                        <div className="absolute -left-[29px] top-1.5 w-3 h-3 rounded-full bg-brand-500 ring-4 ring-surface box-border" />
                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-white">{activity.item.title}</span>
                            <span className="text-xs text-slate-400">
                                Unlocked <span className="text-brand-300">{activity.toStatus}</span> status
                            </span>
                            <span className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider">
                                {new Date(activity.changedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-4 pt-4 border-t border-white/5 text-center">
                <a href="/profile" className="text-xs font-medium text-brand-400 hover:text-brand-300 transition-colors uppercase tracking-wider flex items-center justify-center gap-2 group">
                    View Full Timeline
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                </a>
            </div>
        </GlassCard>
    );
}
