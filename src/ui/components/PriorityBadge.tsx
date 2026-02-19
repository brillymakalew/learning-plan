import React from "react";
import { Priority } from "@/domain/value-objects/enums";
import { cn } from "@/lib/utils";

interface PriorityBadgeProps {
    priority: string;
    className?: string;
}

const styles: Record<string, string> = {
    [Priority.High]: "priority-high",
    [Priority.Medium]: "priority-medium",
    [Priority.Low]: "priority-low",
};

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
    const colorClass = styles[priority] || styles[Priority.Medium];

    return (
        <span className={cn("text-xs font-semibold uppercase tracking-wider flex items-center gap-1", colorClass, className)}>
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            {priority} Priority
        </span>
    );
}
