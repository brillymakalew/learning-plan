import MainLayout from "@/ui/components/MainLayout";

export default function Loading() {
    return (
        <MainLayout>
            <div className="animate-pulse space-y-8">
                <div className="h-8 w-48 bg-surface-card rounded" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="h-64 bg-surface-card rounded" />
                    <div className="h-64 bg-surface-card rounded md:col-span-2" />
                </div>
            </div>
        </MainLayout>
    );
}
