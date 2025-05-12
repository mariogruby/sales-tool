import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { IProduct } from "@/types/product";

export function useProductsByCategory(categoryId?: string) {
    const { data: session } = useSession();
    const [products, setProducts] = useState<IProduct[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!categoryId || !session?.user?.id) return;

        const fetchProducts = async () => {
            setLoading(true);
            try {
                const res = await fetch('/api/category/getByCategory', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        categoryId,
                        restaurantId: session.user.id,
                    }),
                });

                const data = await res.json();
                if (res.ok) {
                    setProducts(data.products);
                    // console.log(data.products)
                } else {
                    setError(data.message);
                }
            } catch (err) {
                setError("Error fetching products");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [categoryId, session]);

    return { products, loading, error };
}
