import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardHeader, CardContent } from "@/components/ui/card"

export function SkeletonGraph() {
    return (
        <Card className="@container/card">
            <CardHeader>
                <Skeleton className="h-6 w-32" /> {/* Título */}
                <Skeleton className="h-4 w-48 mt-2" /> {/* Descripción */}
                <div className="flex gap-4 mt-4">
                    <Skeleton className="h-8 w-40" /> {/* Selector de rango de tiempo */}
                    <Skeleton className="h-8 w-30" /> {/* Selector de tipo de datos */}
                </div>
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                <Skeleton className="h-[150px] w-full" /> {/* Área del gráfico */}
            </CardContent>
        </Card>
    )
}