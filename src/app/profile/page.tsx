// Profile View - Public
import React from "react";
import MainLayout from "@/ui/components/MainLayout";
import { GlassCard } from "@/ui/components/GlassCard";
import { prisma } from "@/infrastructure/db/prisma";
import { CapabilityTag } from "@/domain/value-objects/enums";
import { OwnerAuth } from "@/infrastructure/auth/owner-auth";
import { DeleteHighlightButton } from "@/ui/components/DeleteHighlightButton";

// Direct DB access for MVP instead of UseCase wrapper for simple reads
async function getProfileData() {
    const settings = await prisma.profileSettings.findFirst({
        include: { roadmap: true }
    });

    // Also fetch stats for "Strengths"
    // e.g. count of items done per tag
    const tagCounts = await prisma.item.groupBy({
        by: ['tags'],
        where: { status: 'Done' },
        _count: true
    });

    return { settings, tagCounts };
}

export default async function ProfilePage() {
    const { settings } = await getProfileData();

    return (
        <MainLayout>
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <section className="text-center py-12">
                    <div className="w-24 h-24 bg-gradient-to-br from-brand-500 to-accent-purple rounded-full mx-auto mb-6 flex items-center justify-center text-3xl font-bold text-white shadow-glow">
                        B
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-4">
                        {settings?.headline || "Brilly's Learning Journey"}
                    </h1>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
                        {settings?.about || "Welcome to my learning roadmap. Track my progress as I transition from CS to Management & Organization Studies."}
                    </p>
                </section>

                {/* Capability Grid */}
                <section>
                    <h2 className="section-heading mb-6 text-center">Core Capabilities</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Object.values(CapabilityTag).map((tag) => (
                            <GlassCard key={tag} className="flex flex-col items-center justify-center py-6 hover:bg-surface-card/80 transition group">
                                <span className="text-sm font-medium text-slate-300 group-hover:text-brand-300 transition-colors">{tag}</span>
                                <div className="mt-2 w-12 h-1 bg-surface-border rounded-full overflow-hidden">
                                    <div className="h-full bg-brand-500 w-[0%]"></div> {/* TODO: Calculate width */}
                                </div>
                            </GlassCard>
                        ))}
                    </div>
                </section>

                {/* Timeline / Highlights */}
                <RecentHighlights />
            </div>
        </MainLayout>
    );
}

// Recent Highlights Component (Server Component)
async function RecentHighlights() {
    const isOwner = await OwnerAuth.isOwner();

    // Fetch History
    const history = await prisma.statusHistory.findMany({
        take: 100,
        orderBy: { changedAt: 'desc' },
        include: { item: true }
    });

    // Fetch Evidence
    const evidence = await prisma.evidence.findMany({
        take: 100,
        orderBy: { createdAt: 'desc' },
        include: { item: true }
    });

    // Merge and Sort
    const timeline = [
        ...history.map(h => ({
            type: 'status',
            date: h.changedAt,
            title: h.item.title,
            detail: h.toStatus,
            id: h.id
        })),
        ...evidence.map(e => ({
            type: 'evidence',
            date: e.createdAt,
            title: e.item.title,
            detail: e.title, // Evidence title
            id: e.id
        }))
    ].sort((a, b) => b.date.getTime() - a.date.getTime())
        .slice(0, 200); // Show top 200 (covers P0 simulation + history)

    if (timeline.length === 0) {
        return (
            <section>
                <h2 className="section-heading mb-6">Recent Highlights</h2>
                <GlassCard className="p-8 text-center border-dashed border-2 border-surface-border">
                    <p className="text-slate-500">No recent activity found. Start working on items to see updates here.</p>
                </GlassCard>
            </section>
        );
    }

    return (
        <section>
            <h2 className="section-heading mb-6">Recent Highlights</h2>
            <div className="space-y-4">
                {timeline.map((event, idx) => (
                    <GlassCard key={event.id + idx} className="flex items-center gap-4 p-4 hover:border-brand-500/30 transition-colors group">
                        <div className={`p-2 rounded-full ${event.type === 'status' ? 'bg-indigo-500/20 text-indigo-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
                            {event.type === 'status' ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></svg>
                            )}
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-white">{event.title}</h3>
                            <p className="text-sm text-slate-400">
                                {event.type === 'status' ? (
                                    <>Changed status to <span className="text-brand-300">{event.detail}</span></>
                                ) : (
                                    <>Added evidence: <span className="text-emerald-300">{event.detail}</span></>
                                )}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="text-xs text-slate-500 whitespace-nowrap">
                                {new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </div>
                            {isOwner && (
                                <DeleteHighlightButton
                                    id={event.id}
                                    type={event.type as 'status' | 'evidence'}
                                />
                            )}
                        </div>
                    </GlassCard>
                ))}
            </div>
        </section>
    );
}

