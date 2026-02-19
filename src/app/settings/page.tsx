import React from "react";
import MainLayout from "@/ui/components/MainLayout";
import { OwnerAuth } from "@/infrastructure/auth/owner-auth";
import { LoginForm } from "@/ui/components/settings/LoginForm";
import { GlassCard } from "@/ui/components/GlassCard";

export default async function SettingsPage() {
    const isOwner = await OwnerAuth.isOwner();

    return (
        <MainLayout>
            <div className="max-w-4xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
                    <p className="text-slate-400">Manage your roadmap configuration.</p>
                </header>

                <div className="space-y-8">
                    {/* Authentication Section */}
                    <section>
                        <h2 className="section-heading mb-4">Owner Access</h2>
                        {isOwner ? (
                            <GlassCard className="border-emerald-500/30 bg-emerald-900/10 flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-medium text-white flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                                        Owner Mode Active
                                    </h3>
                                    <p className="text-emerald-300 text-sm mt-1">You have full edit access.</p>
                                </div>
                                {/* Logout button would go here (clear cookie) */}
                            </GlassCard>
                        ) : (
                            <LoginForm />
                        )}
                    </section>

                    {/* Import/Export Section (Placeholder) */}
                    <section>
                        <h2 className="section-heading mb-4">Data Management</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <GlassCard className="opacity-50 cursor-not-allowed">
                                <h3 className="font-medium text-white mb-2">Export Data</h3>
                                <p className="text-sm text-slate-500">Download your roadmap as JSON or Markdown.</p>
                            </GlassCard>
                            <GlassCard className="opacity-50 cursor-not-allowed">
                                <h3 className="font-medium text-white mb-2">Import Data</h3>
                                <p className="text-sm text-slate-500">Restore from a backup or migrate data.</p>
                            </GlassCard>
                        </div>
                    </section>
                </div>
            </div>
        </MainLayout>
    );
}
