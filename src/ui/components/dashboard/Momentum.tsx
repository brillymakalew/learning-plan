import React from "react";
import { GlassCard } from "@/ui/components/GlassCard";
import { Zap } from "lucide-react";

interface MomentumProps {
    count: number;
}

export function Momentum({ count }: MomentumProps) {
    return (
        <GlassCard className="flex flex-col items-center justify-center p-6 bg-brand-900/10 border-brand-500/20">
            <Zap size={32} className="text-brand-400 mb-2 fill-brand-400/20" />
            <span className="text-3xl font-bold text-white">{count}</span>
            <span className="text-xs text-brand-200 mt-1 uppercase tracking-wide">
                Total Active Days
            </span>
        </GlassCard>
    );
}
