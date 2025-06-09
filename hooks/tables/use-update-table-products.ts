// use-update-table-products.ts
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Product } from "./use-table-by-number";

export const useUpdateTableProducts = () => {
    const { data: session } = useSession();

    const updateTableProducts = async ({
        tableNumber,
        products,
    }: {
        tableNumber: number;
        products: Product[];
    }) => {
        try {
            const res = await fetch("/api/table/updateProducts", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    restaurantId: session?.user?.id,
                    tableNumber,
                    products,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.message);
                return false;
            }

            return true;
        } catch (err) {
            console.error(err);
            toast.error("Error al actualizar productos");
            return false;
        }
    };

    return { updateTableProducts };
};
