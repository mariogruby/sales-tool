import { useEffect, useState } from "react";
import { useProductStore } from "@/zustand/use-products-store";
import { useCategoryStore } from "@/zustand/use-categories-store";
import { ICategory } from "@/types/category";

export function useProducts() {
    const setProducts = useProductStore((state) => state.setProducts);
    const setCategoriesStore = useCategoryStore((state) => state.setCategories);
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productRes, categoryRes] = await Promise.all([
                    fetch("/api/product/getProduct"),
                    fetch("/api/category/getCategories"),
                ]);

                const productData = await productRes.json();
                const categoryData = await categoryRes.json();

                if (productRes.ok) {
                    setProducts(productData.products);
                } else {
                    setError(productData.message);
                }

                if (categoryRes.ok) {
                    setCategories(categoryData.categories);
                    setCategoriesStore(categoryData.categories);
                } else {
                    setError(categoryData.message);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                setError("Error fetching data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { categories, loading, error };
}
