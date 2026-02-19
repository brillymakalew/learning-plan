import React from "react";
import { GlassCard } from "@/ui/components/GlassCard";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface PhaseListProps {
    phases: {
        id: string;
        title: string;
        progress: number;
    }[];
    currentPhaseId?: string;
}

export function PhaseList({ phases, currentPhaseId }: PhaseListProps) {
    return (
        <GlassCard className="p-0 overflow-hidden">
            <div className="p-6 border-b border-surface-border">
                <h3 className="text-lg font-semibold text-white">Phases</h3>
            </div>
            <div className="divide-y divide-surface-border">
                {phases.map((phase) => (
                    <div key={phase.id} className="p-4 hover:bg-surface-card/50 transition relative group">
                        <div className="flex justify-between items-center mb-2">
                            <span className={`text-sm font-medium ${phase.id === currentPhaseId ? 'text-brand-400' : 'text-slate-200'}`}>
                                {phase.title}
                                {phase.id === currentPhaseId && <span className="ml-2 text-xs bg-brand-900/40 text-brand-300 px-2 py-0.5 rounded-full">Current</span>}
                            </span>
                            <span className="text-xs text-slate-400">{phase.progress}%</span>
                        </div>

                        <div className="w-full h-1.5 bg-surface-border rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-500 ${phase.progress === 100 ? 'bg-emerald-500' : 'bg-brand-500'}`}
                                style={{ width: `${phase.progress}%` }}
                            />
                        </div>

                        {/* Link overlay */}
                        <Link
                            href={`/roadmap#phase-${phase.id}`} // We'll implement anchors later
                            className="absolute inset-0 flex items-center justify-end px-4 opacity-0 group-hover:opacity-100 transition"
                        >
                            <ChevronRight className="text-slate-400" size={20} />
                        </Link>
                    </div>
                ))}
            </div>
        </GlassCard>
    );
}
