"use client";

import React, { useState } from "react";
import { ItemStatus, Priority, CapabilityTag } from "@/domain/value-objects/enums"; // Assuming enums available to client? 
// Actually enums in TypeScript are objects at runtime, so this works if imported from .ts file.

interface EditItemFormProps {
    initialData?: any;
    sectionId?: string; // If creating new
    onSubmit: (data: any) => Promise<void>;
    onCancel: () => void;
}

export function EditItemForm({ initialData, sectionId, onSubmit, onCancel }: EditItemFormProps) {
    const [formData, setFormData] = useState<{
        title: string;
        status: string;
        priority: string;
        whyItMatters: string;
        whatToLearn: string;
        tags: string[];
        resources: { title: string; url: string }[];
    }>({
        title: initialData?.title || "",
        status: initialData?.status || "NotStarted",
        priority: initialData?.priority || "Medium",
        whyItMatters: initialData?.whyItMatters || "",
        whatToLearn: initialData?.whatToLearn?.join("\n") || "", // Textarea for bullets
        tags: initialData?.tags || [],
        resources: initialData?.resources || []
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Parse bullets
        const whatToLearnArray = formData.whatToLearn.split('\n').filter((l: string) => l.trim().length > 0);

        // Filter empty resources
        const validResources = formData.resources.filter(r => r.title.trim() !== "" && r.url.trim() !== "");

        await onSubmit({
            ...formData,
            whatToLearn: whatToLearnArray,
            resources: validResources,
            sectionId: sectionId // If new
        });
        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Title</label>
                <input
                    type="text"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    className="input-base"
                    required
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Status</label>
                    <select
                        value={formData.status}
                        onChange={e => setFormData({ ...formData, status: e.target.value })}
                        className="input-base bg-surface-muted"
                    >
                        {Object.keys(ItemStatus).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Priority</label>
                    <select
                        value={formData.priority}
                        onChange={e => setFormData({ ...formData, priority: e.target.value })}
                        className="input-base bg-surface-muted"
                    >
                        {Object.keys(Priority).map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Why It Matters</label>
                <textarea
                    value={formData.whyItMatters}
                    onChange={e => setFormData({ ...formData, whyItMatters: e.target.value })}
                    className="input-base min-h-[80px]"
                    required
                />
            </div>

            <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">What to learn (one per line)</label>
                <textarea
                    value={formData.whatToLearn}
                    onChange={e => setFormData({ ...formData, whatToLearn: e.target.value })}
                    className="input-base min-h-[120px]"
                    placeholder="- Key concept 1&#10;- Key concept 2"
                />
            </div>

            {/* Tags could be a multi-select or just checkboxes. Skipping for brevity in MVP form */}

            <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Resources</label>
                <div className="space-y-3">
                    {formData.resources.map((res: any, idx: number) => (
                        <div key={idx} className="flex gap-2 items-start">
                            <input
                                type="text"
                                placeholder="Title"
                                value={res.title}
                                onChange={e => {
                                    const newRes = [...formData.resources];
                                    newRes[idx].title = e.target.value;
                                    setFormData({ ...formData, resources: newRes });
                                }}
                                className="input-base flex-1"
                            />
                            <input
                                type="url"
                                placeholder="https://..."
                                value={res.url}
                                onChange={e => {
                                    const newRes = [...formData.resources];
                                    newRes[idx].url = e.target.value;
                                    setFormData({ ...formData, resources: newRes });
                                }}
                                className="input-base flex-1"
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    const newRes = formData.resources.filter((_, i) => i !== idx);
                                    setFormData({ ...formData, resources: newRes });
                                }}
                                className="p-2 text-slate-500 hover:text-red-400"
                            >
                                &times;
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => setFormData({ ...formData, resources: [...formData.resources, { title: "", url: "" }] })}
                        className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1"
                    >
                        + Add Resource
                    </button>
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-surface-border">
                <button type="button" onClick={onCancel} className="btn-ghost">Cancel</button>
                <button type="submit" disabled={loading} className="btn-primary">
                    {loading ? "Saving..." : "Save Item"}
                </button>
            </div>
        </form>
    );
}
