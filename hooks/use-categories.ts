import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useCategoryStore } from "@/zustand/use-categories-store";

export function useCategories() {
    const { data: session } = useSession();
    const { setCategories, setLoading, setError } = useCategoryStore();

    useEffect(() => {
        const fetchCategories = async () => {
            if (!session?.user?.id) {
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const res = await fetch("/api/category/getCategories", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ restaurantId: session.user.id }),
                });

                const data = await res.json();

                if (res.ok) {
                    setCategories(data.categories);
                    setError("");
                } else {
                    setError(data.message);
                    console.error(data.message);
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
                setError("Error al cargar las categorías");
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, [session, setCategories, setLoading, setError]);

    return null;
}