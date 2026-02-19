"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface DeleteHighlightButtonProps {
    id: string;
    type: 'status' | 'evidence';
}

export function DeleteHighlightButton({ id, type }: DeleteHighlightButtonProps) {
    const router = useRouter();

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this highlight?")) return;

        try {
            const endpoint = type === 'status' ? `/api/history/${id}` : `/api/evidence/${id}`;
            const res = await fetch(endpoint, {
                method: 'DELETE'
            });

            if (!res.ok) throw new Error('Failed to delete');

            router.refresh();
        } catch (e) {
            console.error(e);
            alert("Failed to delete");
        }
    };

    return (
        <button
            onClick={handleDelete}
            className="p-1.5 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
            title="Delete this highlight"
        >
            <Trash2 size={14} />
        </button>
    );
}
