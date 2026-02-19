"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Clock, CheckCircle2, Circle, AlertCircle, FileText, Link as LinkIcon, BookOpen, Edit2, Plus, Trash2 } from "lucide-react";

import { StatusChip } from "@/ui/components/StatusChip";
import { PriorityBadge } from "@/ui/components/PriorityBadge";
import { GlassCard } from "@/ui/components/GlassCard";
import { cn } from "@/lib/utils";
import { Modal } from "@/ui/components/Modal";
import { EditItemForm } from "./EditItemForm";
import { useRouter } from "next/navigation";

interface ItemDetailProps {
    item: any;
    isOwner?: boolean;
}

export function ItemDetailClientView({ item, isOwner }: ItemDetailProps) {
    const [activeTab, setActiveTab] = useState("overview");
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddDeliverableModalOpen, setIsAddDeliverableModalOpen] = useState(false);
    const [isAddEvidenceModalOpen, setIsAddEvidenceModalOpen] = useState(false);
    const [editingEvidence, setEditingEvidence] = useState<any>(null);
    const [editingDeliverable, setEditingDeliverable] = useState<any>(null);
    const router = useRouter();

    // ... handleEditSubmit

    // ... handleCreateDeliverable

    const handleCreateEvidence = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = {
            title: formData.get("title"),
            type: formData.get("type"),
            url: formData.get("url"),
            description: formData.get("description"),
            reviewedBy: formData.get("reviewedBy") || undefined
        };

        try {
            const res = await fetch(`/api/items/${item.id}/evidence`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!res.ok) throw new Error('Failed to create evidence');

            setIsAddEvidenceModalOpen(false);
            router.refresh();
        } catch (e) {
            console.error(e);
            alert("Failed to create evidence");
        }
    };

    const [uploading, setUploading] = useState(false);
    const [evidenceSource, setEvidenceSource] = useState<'file' | 'url'>('file');

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, setUrl: (url: string) => void) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData
            });
            const data = await res.json();
            if (data.url) {
                setUrl(data.url);
            } else {
                alert("Upload failed");
            }
        } catch (err) {
            console.error(err);
            alert("Upload error");
        } finally {
            setUploading(false);
        }
    };

    const handleUpdateEvidence = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!editingEvidence) return;

        const formData = new FormData(e.currentTarget);
        const data = {
            title: formData.get("title"),
            type: formData.get("type"),
            url: formData.get("url"),
            description: formData.get("description"),
            reviewedBy: formData.get("reviewedBy") || undefined
        };

        try {
            const res = await fetch(`/api/evidence/${editingEvidence.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!res.ok) throw new Error('Failed to update evidence');

            setEditingEvidence(null);
            router.refresh();
        } catch (e) {
            console.error(e);
            alert("Failed to update evidence");
        }
    };

    const handleEditSubmit = async (data: any) => {
        try {
            const res = await fetch(`/api/items/${item.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!res.ok) throw new Error('Failed to update');

            setIsEditModalOpen(false);
            router.refresh();
        } catch (e) {
            console.error(e);
            alert("Failed to save changes");
        }
    };

    const handleCreateDeliverable = async (e: React.FormEvent<HTMLFormElement>) => {
        // ... (existing implementation)
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = {
            title: formData.get("title"),
            type: formData.get("type"),
            acceptanceCriteria: (formData.get("acceptanceCriteria") as string).split('\n').filter(Boolean)
        };

        try {
            const res = await fetch(`/api/items/${item.id}/deliverables`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!res.ok) throw new Error('Failed to create deliverable');

            setIsAddDeliverableModalOpen(false);
            router.refresh();
        } catch (e) {
            console.error(e);
            alert("Failed to create deliverable");
        }
    };

    const handleDeleteEvidence = async (evidenceId: string) => {
        if (!confirm("Are you sure you want to delete this evidence? This cannot be undone.")) return;

        try {
            const res = await fetch(`/api/evidence/${evidenceId}`, {
                method: 'DELETE'
            });

            if (!res.ok) throw new Error('Failed to delete evidence');

            router.refresh();
        } catch (e) {
            console.error(e);
            alert("Failed to delete evidence");
        }
    };

    const handleDeleteDeliverable = async (deliverableId: string) => {
        if (!confirm("Are you sure you want to delete this deliverable?")) return;

        try {
            const res = await fetch(`/api/deliverables/${deliverableId}`, {
                method: 'DELETE'
            });

            if (!res.ok) throw new Error('Failed to delete deliverable');

            router.refresh();
        } catch (e) {
            console.error(e);
            alert("Failed to delete deliverable");
        }
    };

    const handleUpdateDeliverable = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!editingDeliverable) return;

        const formData = new FormData(e.currentTarget);
        const data = {
            title: formData.get("title"),
            type: formData.get("type"),
            acceptanceCriteria: (formData.get("acceptanceCriteria") as string).split('\n').filter(Boolean),
            status: editingDeliverable.status // Keep status as is (or allow toggle?) Usually distinct action.
        };

        try {
            const res = await fetch(`/api/deliverables/${editingDeliverable.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!res.ok) throw new Error('Failed to update deliverable');

            setEditingDeliverable(null);
            router.refresh();
        } catch (e) {
            console.error(e);
            alert("Failed to update deliverable");
        }
    };

    const tabs = [
        { id: "overview", label: "Overview", icon: FileText },
        { id: "deliverables", label: "Deliverables", icon: CheckCircle2, count: item.deliverables.length },
        { id: "evidence", label: "Evidence", icon: LinkIcon, count: item.evidence.length },
        { id: "resources", label: "Resources", icon: BookOpen, count: item.resources.length },
    ];

    return (
        <div className="max-w-4xl mx-auto pb-20">
            {/* Back Link */}
            <Link href="/roadmap" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition">
                <ArrowLeft size={18} />
                Back to Roadmap
            </Link>

            {/* Header */}
            <div className="mb-8 p-6 glass-card relative overflow-hidden">
                {/* Decorative background blur */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 blur-[80px] rounded-full pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <StatusChip status={item.status} />
                            <PriorityBadge priority={item.priority} />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">{item.title}</h1>

                        {item.section?.title && (
                            <p className="text-slate-400 flex items-center gap-2">
                                Phase: <span className="text-slate-300">{item.section.phase?.title}</span>
                                <span className="opacity-50">/</span>
                                Section: <span className="text-slate-300">{item.section.title}</span>
                            </p>
                        )}
                    </div>

                    {isOwner && (
                        <button
                            onClick={() => setIsEditModalOpen(true)}
                            className="btn-ghost border border-surface-border hover:bg-surface-border text-slate-300 hover:text-white whitespace-nowrap"
                        >
                            <Edit2 size={16} />
                            Edit Item
                        </button>
                    )}
                </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 border-b border-surface-border mb-8 overflow-x-auto">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                                isActive
                                    ? "border-brand-500 text-brand-400"
                                    : "border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700"
                            )}
                        >
                            <Icon size={16} />
                            {tab.label}
                            {tab.count !== undefined && (
                                <span className={cn(
                                    "px-1.5 py-0.5 text-[10px] rounded-full",
                                    isActive ? "bg-brand-500/20 text-brand-300" : "bg-surface-border text-slate-500"
                                )}>
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Content */}
            <div className="space-y-8 min-h-[400px]">
                {activeTab === "overview" && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in">
                        <div className="md:col-span-2 space-y-8">
                            <section>
                                <h3 className="section-heading mb-3">Why It Matters</h3>
                                <p className="text-slate-300 leading-relaxed text-lg">
                                    {item.whyItMatters}
                                </p>
                            </section>

                            <section>
                                <h3 className="section-heading mb-3">What To Learn</h3>
                                <GlassCard className="bg-surface-muted/20">
                                    <ul className="space-y-3">
                                        {item.whatToLearn.map((point: string, i: number) => (
                                            <li key={i} className="flex items-start gap-3 text-slate-200">
                                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-500 flex-shrink-0" />
                                                <span>{point}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </GlassCard>
                            </section>
                        </div>

                        <div className="space-y-6">
                            <section>
                                <h3 className="section-heading mb-3">Tags</h3>
                                <div className="flex flex-wrap gap-2">
                                    {item.tags.map((tag: string) => (
                                        <span key={tag} className="text-xs bg-surface-card border border-surface-border px-2 py-1 rounded-md text-slate-400">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </section>

                            <section>
                                <h3 className="section-heading mb-3">History</h3>
                                <div className="relative pl-4 border-l border-surface-border space-y-4">
                                    {item.statusHistory.map((history: any) => (
                                        <div key={history.id} className="relative">
                                            <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-surface-border ring-4 ring-surface" />
                                            <p className="text-xs text-slate-400">
                                                Changed to <span className="text-slate-200">{history.toStatus}</span>
                                            </p>
                                            <p className="text-[10px] text-slate-600">
                                                {new Date(history.changedAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>
                    </div>
                )}

                {activeTab === "deliverables" && (
                    <div className="space-y-4 animate-fade-in">
                        {isOwner && (
                            <button
                                onClick={() => setIsAddDeliverableModalOpen(true)}
                                className="w-full py-3 border border-dashed border-surface-border rounded-lg text-slate-500 hover:text-brand-400 hover:border-brand-500/50 transition flex items-center justify-center gap-2"
                            >
                                <Plus size={16} /> Add Deliverable
                            </button>
                        )}
                        {item.deliverables.length === 0 ? (
                            <p className="text-slate-500 text-sm text-center py-8">No specific deliverables set yet.</p>
                        ) : (
                            item.deliverables.map((d: any) => (
                                <GlassCard key={d.id} className="flex justify-between items-center group">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs uppercase text-brand-400 font-semibold">{d.type}</span>
                                            {d.status === 'Done' && <CheckCircle2 size={12} className="text-emerald-500" />}
                                        </div>
                                        <h4 className={cn("text-lg font-medium", d.status === 'Done' ? "text-slate-500 line-through" : "text-slate-200")}>
                                            {d.title}
                                        </h4>
                                    </div>
                                    {isOwner && (
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                                            <button
                                                onClick={() => setEditingDeliverable(d)}
                                                className="p-2 text-slate-500 hover:text-white"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteDeliverable(d.id)}
                                                className="p-2 text-slate-500 hover:text-red-400"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    )}
                                </GlassCard>
                            ))
                        )}
                    </div>
                )}

                {activeTab === "evidence" && (
                    <div className="space-y-4 animate-fade-in">
                        {isOwner && (
                            <button
                                onClick={() => setIsAddEvidenceModalOpen(true)}
                                className="w-full py-3 border border-dashed border-surface-border rounded-lg text-slate-500 hover:text-brand-400 hover:border-brand-500/50 transition flex items-center justify-center gap-2"
                            >
                                <Plus size={16} /> Add Evidence
                            </button>
                        )}
                        {item.evidence.length === 0 ? (
                            <p className="text-slate-500 text-sm text-center py-8">No evidence recorded yet.</p>
                        ) : (
                            item.evidence.map((ev: any) => (
                                <GlassCard key={ev.id} className="flex justify-between items-start group">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs uppercase text-brand-400 font-semibold">{ev.type}</span>
                                            {ev.reviewedBy && (
                                                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20">
                                                    Reviewed by {ev.reviewedBy}
                                                </span>
                                            )}
                                        </div>
                                        <a href={ev.url} target="_blank" rel="noopener noreferrer" className="text-lg font-medium text-slate-200 hover:text-brand-400 hover:underline flex items-center gap-2">
                                            {ev.title} <LinkIcon size={14} />
                                        </a>
                                        {ev.description && <p className="text-slate-400 text-sm mt-1">{ev.description}</p>}
                                    </div>
                                    {isOwner && (
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                                            <button
                                                onClick={() => setEditingEvidence(ev)}
                                                className="p-2 text-slate-500 hover:text-white"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteEvidence(ev.id)}
                                                className="p-2 text-slate-500 hover:text-red-400"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    )}
                                </GlassCard>
                            ))
                        )}
                    </div>
                )}

                {activeTab === "resources" && (
                    <div className="space-y-4 animate-fade-in">
                        {isOwner && (
                            <div className="text-right mb-4">
                                <button
                                    onClick={() => setIsEditModalOpen(true)}
                                    className="text-xs text-brand-400 hover:text-brand-300 flex items-center justify-end gap-1 ml-auto"
                                >
                                    <Edit2 size={12} /> Manage Resources in Edit Item
                                </button>
                            </div>
                        )}
                        {item.resources.length === 0 ? (
                            <p className="text-slate-500 text-sm text-center py-8">No learning resources added.</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {item.resources.map((res: any, idx: number) => (
                                    <a
                                        key={idx}
                                        href={res.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-4 glass-card hover:bg-surface-card transition flex items-start gap-3 group"
                                    >
                                        <div className="bg-surface-border p-2 rounded-lg text-slate-400 group-hover:text-brand-400 transition-colors">
                                            <BookOpen size={20} />
                                        </div>
                                        <div>
                                            <h4 className="text-slate-200 font-medium group-hover:text-brand-300 transition-colors">{res.title}</h4>
                                            <p className="text-xs text-slate-500 mt-1 truncate max-w-[200px]">{res.url}</p>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {isOwner && (
                    <>
                        <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Item">
                            <EditItemForm
                                initialData={item}
                                onSubmit={handleEditSubmit}
                                onCancel={() => setIsEditModalOpen(false)}
                            />
                        </Modal>

                        <Modal isOpen={isAddDeliverableModalOpen} onClose={() => setIsAddDeliverableModalOpen(false)} title="Add Deliverable">
                            <form onSubmit={handleCreateDeliverable} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Title</label>
                                    <input
                                        type="text"
                                        name="title"
                                        className="input-base"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Type</label>
                                    <select name="type" className="input-base bg-surface-muted" required>
                                        <option value="Paper">Paper</option>
                                        <option value="Slide">Slide</option>
                                        <option value="Code">Code</option>
                                        <option value="Dataset">Dataset</option>
                                        <option value="Prototype">Prototype</option>
                                        <option value="Report">Report</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Acceptance Criteria (one per line)</label>
                                    <textarea
                                        name="acceptanceCriteria"
                                        className="input-base min-h-[100px]"
                                        placeholder="- Must explain X..."
                                    />
                                </div>
                                <div className="flex justify-end gap-3 pt-4 border-t border-surface-border">
                                    <button type="button" onClick={() => setIsAddDeliverableModalOpen(false)} className="btn-ghost">Cancel</button>
                                    <button type="submit" className="btn-primary">Add Deliverable</button>
                                </div>
                            </form>
                        </Modal>

                        <Modal isOpen={!!editingDeliverable} onClose={() => setEditingDeliverable(null)} title="Edit Deliverable">
                            <form onSubmit={handleUpdateDeliverable} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Title</label>
                                    <input
                                        type="text"
                                        name="title"
                                        className="input-base"
                                        required
                                        defaultValue={editingDeliverable?.title}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Type</label>
                                    <select name="type" className="input-base bg-surface-muted" required defaultValue={editingDeliverable?.type}>
                                        <option value="Paper">Paper</option>
                                        <option value="Slide">Slide</option>
                                        <option value="Code">Code</option>
                                        <option value="Dataset">Dataset</option>
                                        <option value="Prototype">Prototype</option>
                                        <option value="Report">Report</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Acceptance Criteria (one per line)</label>
                                    <textarea
                                        name="acceptanceCriteria"
                                        className="input-base min-h-[100px]"
                                        placeholder="- Must explain X..."
                                        defaultValue={editingDeliverable?.acceptanceCriteria?.join('\n')}
                                    />
                                </div>
                                <div className="flex justify-end gap-3 pt-4 border-t border-surface-border">
                                    <button type="button" onClick={() => setEditingDeliverable(null)} className="btn-ghost">Cancel</button>
                                    <button type="submit" className="btn-primary">Save Changes</button>
                                </div>
                            </form>
                        </Modal>

                        <Modal isOpen={isAddEvidenceModalOpen} onClose={() => setIsAddEvidenceModalOpen(false)} title="Add Evidence">
                            <form onSubmit={handleCreateEvidence} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Title</label>
                                    <input name="title" className="input-base" required />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Type</label>
                                        <select name="type" className="input-base bg-surface-muted" required>
                                            <option value="note">Note</option>
                                            <option value="summary">Summary</option>
                                            <option value="memo">Memo</option>
                                            <option value="slide">Slide</option>
                                            <option value="paper">Paper</option>
                                            <option value="repo">Repo</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Reviewed By</label>
                                        <input name="reviewedBy" className="input-base" placeholder="Optional" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Source</label>
                                    <div className="flex items-center gap-4 mb-2">
                                        <label className="flex items-center gap-2 text-sm text-slate-300">
                                            <input
                                                type="radio"
                                                name="sourceType"
                                                checked={evidenceSource === 'file'}
                                                onChange={() => setEvidenceSource('file')}
                                                className="text-brand-500 focus:ring-brand-500"
                                            />
                                            Upload File
                                        </label>
                                        <label className="flex items-center gap-2 text-sm text-slate-300">
                                            <input
                                                type="radio"
                                                name="sourceType"
                                                checked={evidenceSource === 'url'}
                                                onChange={() => setEvidenceSource('url')}
                                                className="text-brand-500 focus:ring-brand-500"
                                            />
                                            External Link
                                        </label>
                                    </div>

                                    {evidenceSource === 'file' ? (
                                        <div className="border-2 border-dashed border-surface-border rounded-lg p-4 text-center hover:border-brand-500/50 transition bg-surface-muted/30">
                                            <input
                                                type="file"
                                                onChange={(e) => {
                                                    const input = e.target.closest('form')?.querySelector('input[name="url"]') as HTMLInputElement;
                                                    if (input) handleFileUpload(e, (url) => { input.value = url; });
                                                }}
                                                className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-brand-500 file:text-white hover:file:bg-brand-600 cursor-pointer"
                                            />
                                            {uploading && <p className="text-xs text-brand-400 mt-2 animate-pulse">Uploading...</p>}
                                        </div>
                                    ) : (
                                        <input name="url" type="url" className="input-base" placeholder="https://..." required />
                                    )}
                                    {/* Hidden URL input for file uploads */}
                                    <input name="url" type="hidden" required={evidenceSource === 'url'} />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Description</label>
                                    <textarea name="description" className="input-base min-h-[80px]" />
                                </div>
                                <div className="flex justify-end gap-3 pt-4 border-t border-surface-border">
                                    <button type="button" onClick={() => setIsAddEvidenceModalOpen(false)} className="btn-ghost">Cancel</button>
                                    <button type="submit" className="btn-primary">Add Evidence</button>
                                </div>
                            </form>
                        </Modal>
                        <Modal isOpen={!!editingEvidence} onClose={() => setEditingEvidence(null)} title="Edit Evidence">
                            <form onSubmit={handleUpdateEvidence} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Title</label>
                                    <input name="title" className="input-base" required defaultValue={editingEvidence?.title} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Type</label>
                                        <select name="type" className="input-base bg-surface-muted" required defaultValue={editingEvidence?.type}>
                                            <option value="note">Note</option>
                                            <option value="summary">Summary</option>
                                            <option value="memo">Memo</option>
                                            <option value="slide">Slide</option>
                                            <option value="paper">Paper</option>
                                            <option value="repo">Repo</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Reviewed By</label>
                                        <input name="reviewedBy" className="input-base" placeholder="Optional" defaultValue={editingEvidence?.reviewedBy || ""} />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Source</label>
                                    <div className="flex items-center gap-4 mb-2">
                                        <label className="flex items-center gap-2 text-sm text-slate-300">
                                            <input
                                                type="radio"
                                                name="sourceType"
                                                checked={evidenceSource === 'file'}
                                                onChange={() => setEvidenceSource('file')}
                                                className="text-brand-500 focus:ring-brand-500"
                                            />
                                            Upload File
                                        </label>
                                        <label className="flex items-center gap-2 text-sm text-slate-300">
                                            <input
                                                type="radio"
                                                name="sourceType"
                                                checked={evidenceSource === 'url'}
                                                onChange={() => setEvidenceSource('url')}
                                                className="text-brand-500 focus:ring-brand-500"
                                            />
                                            External Link
                                        </label>
                                    </div>

                                    {evidenceSource === 'file' ? (
                                        <div className="border-2 border-dashed border-surface-border rounded-lg p-4 text-center hover:border-brand-500/50 transition bg-surface-muted/30">
                                            <input
                                                type="file"
                                                onChange={(e) => {
                                                    const input = e.target.closest('form')?.querySelector('input[name="url"]') as HTMLInputElement;
                                                    if (input) {
                                                        handleFileUpload(e, (url) => {
                                                            input.value = url;
                                                            // Update state to reflect change immediately
                                                            setEditingEvidence((prev: any) => ({ ...prev, url }));
                                                        });
                                                    }
                                                }}
                                                className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-brand-500 file:text-white hover:file:bg-brand-600 cursor-pointer"
                                            />
                                            {uploading && <p className="text-xs text-brand-400 mt-2 animate-pulse">Uploading...</p>}
                                            {editingEvidence?.url && <p className="text-xs text-slate-500 mt-2">Current: {editingEvidence.url}</p>}
                                        </div>
                                    ) : (
                                        <input name="url" type="url" className="input-base" required defaultValue={editingEvidence?.url} />
                                    )}
                                    {/* Hidden URL input for file uploads */}
                                    <input name="url" type="hidden" required={evidenceSource === 'url'} defaultValue={editingEvidence?.url} />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Description</label>
                                    <textarea name="description" className="input-base min-h-[80px]" defaultValue={editingEvidence?.description || ""} />
                                </div>
                                <div className="flex justify-end gap-3 pt-4 border-t border-surface-border">
                                    <button type="button" onClick={() => setEditingEvidence(null)} className="btn-ghost">Cancel</button>
                                    <button type="submit" className="btn-primary">Save Changes</button>
                                </div>
                            </form>
                        </Modal>
                    </>
                )
                }
            </div >
        </div >
    );
}
