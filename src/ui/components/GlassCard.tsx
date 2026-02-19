import React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
    hoverEffect?: boolean;
}

export function GlassCard({ className, hoverEffect, children, ...props }: GlassCardProps) {
    return (
        <div
            className={cn(
                "glass-card p-6",
                hoverEffect && "glass-card-hover cursor-pointer",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}
