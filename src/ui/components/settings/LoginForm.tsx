"use client";

import React, { useState } from "react";
import { GlassCard } from "@/ui/components/GlassCard";
import { Lock, Unlock, AlertCircle } from "lucide-react";

export function LoginForm() {
    const [key, setKey] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/owner/unlock", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ key }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Login failed");
            }

            setSuccess(true);
            window.location.reload(); // Reload to pick up cookie state
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <GlassCard className="text-center p-8 border-emerald-500/30 bg-emerald-900/10">
                <Unlock className="mx-auto text-emerald-400 mb-4" size={32} />
                <h2 className="text-xl font-bold text-white mb-2">Unlocked!</h2>
                <p className="text-emerald-300">Owner mode active. You can now edit the roadmap.</p>
            </GlassCard>
        );
    }

    return (
        <GlassCard className="max-w-md mx-auto">
            <div className="text-center mb-6">
                <Lock className="mx-auto text-brand-400 mb-4" size={32} />
                <h2 className="text-xl font-bold text-white">Owner Login</h2>
                <p className="text-slate-400 text-sm mt-2">
                    Enter your owner key to unlock editing capabilities.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <input
                        type="password"
                        value={key}
                        onChange={(e) => setKey(e.target.value)}
                        placeholder="Enter owner key..."
                        className="input-base text-center tracking-widest"
                        required
                    />
                </div>

                {error && (
                    <div className="flex items-center gap-2 text-red-400 text-sm bg-red-900/20 p-3 rounded-lg border border-red-500/20">
                        <AlertCircle size={16} />
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-primary justify-center py-2.5"
                >
                    {loading ? "Verifying..." : "Unlock"}
                </button>
            </form>
        </GlassCard>
    );
}
