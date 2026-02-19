import { TopNav } from "@/ui/components/TopNav";

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen pt-16 flex flex-col">
            <TopNav />
            {/* 
        PRD Layout mentions a "Right Context Panel". 
        For now, we render children in a container. 
        The context panel can be part of specific pages or a responsive sidebar here.
      */}
            <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </div>
        </div>
    );
}
