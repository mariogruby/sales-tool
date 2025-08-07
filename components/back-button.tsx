"use client"

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function BackButton() {
    const router = useRouter();

    return (
        <Button
            variant="ghost"
            className="flex items-center space-x-2 mb-6"
            onClick={() => router.back()}
        >
            <ArrowLeft className="h-4 w-4" />
            <span>Volver</span>
        </Button>
    );
}
