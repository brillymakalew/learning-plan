import React from "react";
import { ItemStatus } from "@/domain/value-objects/enums";
import { cn } from "@/lib/utils"; // Need to create a utility for class names

const statusStyles: Record<string, string> = {
    [ItemStatus.NotStarted]: "status-not-started",
    [ItemStatus.InProgress]: "status-in-progress",
    [ItemStatus.Done]: "status-done",
    [ItemStatus.Blocked]: "status-blocked",
    [ItemStatus.Archived]: "status-archived",
};

const statusLabels: Record<string, string> = {
    [ItemStatus.NotStarted]: "Not Started",
    [ItemStatus.InProgress]: "In Progress",
    [ItemStatus.Done]: "Done",
    [ItemStatus.Blocked]: "Blocked",
    [ItemStatus.Archived]: "Archived",
};

interface StatusChipProps {
    status: string;
    className?: string;
}

export function StatusChip({ status, className }: StatusChipProps) {
    const style = statusStyles[status] || statusStyles[ItemStatus.NotStarted];
    const label = statusLabels[status] || status;

    return <span className={`status-chip ${style} ${className || ""}`}>{label}</span>;
}
