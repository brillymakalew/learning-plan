import React from "react";
import { GlassCard } from "@/ui/components/GlassCard";

interface OverallProgressProps {
    percentage: number;
}

export function OverallProgress({ percentage }: OverallProgressProps) {
    // SVG Circle calculations
    const radius = 60;
    const stroke = 12;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <GlassCard className="flex flex-col items-center justify-center py-8">
            <div className="relative flex items-center justify-center">
                <svg
                    height={radius * 2}
                    width={radius * 2}
                    className="rotate-[-90deg] transition-all duration-1000 ease-out"
                >
                    <circle
                        stroke="currentColor"
                        fill="transparent"
                        strokeWidth={stroke}
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                        className="text-surface-border"
                    />
                    <circle
                        stroke="currentColor"
                        fill="transparent"
                        strokeWidth={stroke}
                        strokeDasharray={circumference + " " + circumference}
                        style={{ strokeDashoffset }}
                        strokeLinecap="round"
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                        className="text-brand-500 transition-all duration-1000"
                    />
                </svg>
                <div className="absolute flex flex-col items-center">
                    <span className="text-4xl font-bold text-white">{percentage}%</span>
                </div>
            </div>
            <h3 className="mt-4 text-sm font-medium text-slate-400 uppercase tracking-widest">
                Total Complete
            </h3>
        </GlassCard>
    );
}
