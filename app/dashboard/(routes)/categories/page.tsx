"use client"

import { useCategoryStore } from "@/zustand/use-categories-store"
import ProductsByCategories from "./components/products-by-categories"

const Page = () => {
    const selectedCategoryId = useCategoryStore((state) => state.selectedCategoryId)

    return (
        <div className="container mx-auto py-4">
            <ProductsByCategories categoryId={selectedCategoryId} />
        </div>
    );
};

export default Page;
