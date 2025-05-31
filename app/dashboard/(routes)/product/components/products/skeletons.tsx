import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardHeader, CardFooter } from "@/components/ui/card"

export function ProductSkeleton() {
    return (
        <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
            {[...Array(16)].map((_, index) => (
                <Card key={index} className="@container/card">
                    <CardHeader className="flex justify-between items-start">
                        <Skeleton className="h-8 w-3/4 @[250px]/card:h-9" />
                    </CardHeader>
                    <CardFooter className="flex-col items-start gap-1.5">
                        <Skeleton className="h-6 w-1/3" />
                    </CardFooter>
                </Card>
            ))}
        </div>
    )
}