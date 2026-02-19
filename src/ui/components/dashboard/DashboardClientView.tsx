"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sandglass } from "./Sandglass";
import { PhaseList } from "./PhaseList";
import { NextUp } from "./NextUp";
import { RecentActivity } from "./RecentActivity";
import { Momentum } from "./Momentum";
import { ChevronDown } from "lucide-react";

interface DashboardClientViewProps {
    data: any; // The full dashboard summary object
}

export function DashboardClientView({ data }: DashboardClientViewProps) {
    return (
        <div className="min-h-screen flex flex-col items-center mx-auto pb-20 relative">

            {/* Background elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[50vh] bg-gradient-to-b from-brand-900/10 to-transparent blur-3xl z-[-1]" />
            </div>

            {/* Hero Section: Sandglass */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="flex flex-col items-center justify-center mt-10 md:mt-20 mb-16 relative z-10"
            >
                <div className="mb-6 text-center">
                    <h2 className="text-brand-300 font-medium text-lg tracking-wide uppercase">Brilly's Temporal Shift</h2>
                    <p className="text-slate-500 text-sm mt-1 max-w-md mx-auto">
                        Refactoring the Source Code of Thought
                    </p>
                </div>

                <Sandglass percentage={data.overallProgress} />

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="mt-12 flex flex-col items-center text-slate-500/50"
                >
                    <span className="text-xs uppercase tracking-[0.3em] font-medium mb-2">Scroll</span>
                    <ChevronDown className="animate-bounce" size={20} />
                </motion.div>
            </motion.div>

            {/* Main Content Grid (Always Visible) */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="w-full max-w-7xl px-4 md:px-6 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start z-10"
            >
                {/* Left Sidebar: Phases Navigation (Tall) */}
                <div className="lg:col-span-4 xl:col-span-3 space-y-6">
                    <PhaseList phases={data.phases} />
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-8 xl:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Hero Card: Current Phase (Spans full width of main area) */}
                    <div className="md:col-span-2">
                        <div className="glass-card p-8 border-brand-500/30 bg-surface-card/60 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <div className="w-32 h-32 bg-brand-500 rounded-full blur-3xl"></div>
                            </div>

                            <h3 className="text-xs font-bold text-brand-300 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></span>
                                Current Focus
                            </h3>

                            {data.currentPhase ? (
                                <div>
                                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
                                        <h2 className="text-3xl font-bold text-white leading-tight max-w-2xl text-balance">
                                            {data.currentPhase.title}
                                        </h2>
                                        <div className="text-right shrink-0">
                                            <div className="text-4xl font-bold text-brand-400">{data.currentPhase.progress}%</div>
                                            <div className="text-xs text-slate-500 uppercase tracking-wider">Complete</div>
                                        </div>
                                    </div>

                                    <div className="h-3 w-full bg-surface-muted/50 rounded-full overflow-hidden backdrop-blur-sm border border-white/5">
                                        <div
                                            className="h-full bg-gradient-to-r from-brand-600 to-brand-400 relative"
                                            style={{ width: `${data.currentPhase.progress}%` }}
                                        >
                                            <div className="absolute inset-0 bg-white/20 animate-pulse-slow"></div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-slate-400 italic">All phases completed! Time to celebrate. 🚀</div>
                            )}
                        </div>
                    </div>

                    {/* Left Column of Main: Actionable */}
                    <div className="space-y-6">
                        <NextUp items={data.nextUp} />
                        <Momentum count={data.momentum} />
                    </div>

                    {/* Right Column of Main: History */}
                    <div className="space-y-6">
                        <RecentActivity activities={data.recentActivity} />
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
