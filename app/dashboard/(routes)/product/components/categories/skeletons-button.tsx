import { Skeleton } from "@/components/ui/skeleton"

export function AllCategoriesButtonsSkeleton() {
    return (
        <div className="flex flex-wrap gap-2 mb-4 px-4 lg:px-6 gap-4">
            <Skeleton className="h-9 w-20 rounded-md" />
            {[...Array(7)].map((_, i) => (
                <Skeleton key={i} className="h-9 w-24 rounded-md" />
            ))}
        </div>
    )
}
