"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Map, User, Settings, LogOut, Moon, Sun, FileCheck } from "lucide-react";
import { cn } from "@/lib/utils";

// Top Navigation Bar
export function TopNav() {
    const pathname = usePathname();
    const [isDark, setIsDark] = React.useState(true); // Default dark

    const toggleTheme = () => {
        const root = document.documentElement;
        if (isDark) {
            root.classList.remove("dark");
            root.classList.add("light");
        } else {
            root.classList.remove("light");
            root.classList.add("dark");
        }
        setIsDark(!isDark);
    };

    const navItems = [
        { href: "/", label: "Dashboard", icon: LayoutDashboard },
        { href: "/roadmap", label: "Roadmap", icon: Map },
        { href: "/evidence", label: "Evidence", icon: FileCheck },
        { href: "/profile", label: "Profile", icon: User },
        { href: "/settings", label: "Settings", icon: Settings },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-surface-border bg-surface/80 backdrop-blur-md px-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center text-white font-bold text-lg">
                    B
                </div>
                <span className="font-bold text-lg tracking-tight hidden sm:block">Brilly's Learning Plan</span>
            </div>

            <div className="flex items-center gap-1 md:gap-4">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-brand-500/10 text-brand-400"
                                    : "text-slate-400 hover:text-slate-200 hover:bg-surface-card"
                            )}
                        >
                            <Icon size={18} />
                            <span className="hidden md:inline">{item.label}</span>
                        </Link>
                    );
                })}
            </div>

            <div className="flex items-center gap-3">
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full text-slate-400 hover:bg-surface-card hover:text-slate-200 transition"
                    aria-label="Toggle theme"
                >
                    {isDark ? <Moon size={20} /> : <Sun size={20} />}
                </button>
            </div>
        </nav>
    );
}
