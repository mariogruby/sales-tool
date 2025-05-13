import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SaleProduct {
    productId: string;
    name: string;
    price: number;
    quantity: number;
}

type PaymentType = 'efectivo' | 'tarjeta';
type Status = 'pagado' | 'pendiente';

interface SaleState {
    products: SaleProduct[];
    paymentType: PaymentType;
    status: Status;
    addProduct: (product: SaleProduct) => void;
    removeProduct: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    setPaymentType: (type: PaymentType) => void;
    setStatus: (status: Status) => void;
    clearSale: () => void;
    total: number;
}

export const useSaleStore = create(
    persist<SaleState>(
        (set, get) => ({
            products: [],
            paymentType: 'tarjeta',
            status: 'pendiente',
            addProduct: (newProduct) =>
                set((state) => {
                    const existingIndex = state.products.findIndex(
                        (p) => p.productId.toString() === newProduct.productId.toString()
                    );

                    if (existingIndex !== -1) {
                        // Si ya existe, sumar cantidad
                        const updatedProducts = [...state.products];
                        updatedProducts[existingIndex].quantity += newProduct.quantity;
                        return { products: updatedProducts };
                    } else {
                        // Si no existe, agregar nuevo
                        return { products: [...state.products, newProduct] };
                    }
                }),

            removeProduct: (productId) =>
                set({
                    products: get().products.filter(p => p.productId !== productId)
                }),

            updateQuantity: (productId, quantity) =>
                set({
                    products: get().products.map(p =>
                        p.productId === productId ? { ...p, quantity } : p
                    )
                }),

            setPaymentType: (type) => set({ paymentType: type }),
            setStatus: (status) => set({ status }),

            clearSale: () => set({ products: [], paymentType: 'tarjeta', status: 'pendiente' }),

            total: 0 // Se actualiza abajo
        }),
        {
            name: 'sale-storage',
            partialize: (state) => ({
                products: state.products,
                paymentType: state.paymentType,
                status: state.status
            }),
        }
    )
);