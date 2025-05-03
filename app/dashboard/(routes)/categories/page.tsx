// page.tsx

"use client"

import { AllCategories } from "./components/all-categories"
import { useCategories } from "@/hooks/use-categories"

const Page = () => {
    const { categories, loading, error } = useCategories()

    return (
        <div className="container mx-auto py-4">
            <AllCategories categories={categories} loading={loading} error={error} />
        </div>
    )
}

export default Page
