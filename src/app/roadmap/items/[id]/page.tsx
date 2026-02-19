import React from "react";
import MainLayout from "@/ui/components/MainLayout";
import { GetItemDetailUseCase } from "@/application/use-cases/get-item-detail";
import { ItemDetailClientView } from "@/ui/components/roadmap/ItemDetailClientView";
import { OwnerAuth } from "@/infrastructure/auth/owner-auth";
import { notFound } from "next/navigation";

export default async function ItemDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    try {
        const useCase = new GetItemDetailUseCase();
        const item = await useCase.execute(id);
        const isOwner = await OwnerAuth.isOwner();

        return (
            <MainLayout>
                <ItemDetailClientView item={item} isOwner={isOwner} />
            </MainLayout>
        );
    } catch (error) {
        console.error(error);
        notFound();
    }
}
