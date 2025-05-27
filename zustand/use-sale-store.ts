import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SaleProduct {
    productId: string;
    name: string;
    price: number;
    quantity: number;
}

type PaymentType = "efectivo" | "tarjeta" | "dividido";
type Status = "pagado" | "pendiente";

interface SaleState {
    products: SaleProduct[];
    paymentType: PaymentType;
    paymentDetails: {
        cashAmount: number;
        cardAmount: number;
    };
    status: Status;
    addProduct: (product: SaleProduct) => void;
    removeProduct: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    setPaymentType: (type: PaymentType) => void;
    setCashAmount: (amount: number) => void;
    setCardAmount: (amount: number) => void;
    setStatus: (status: Status) => void;
    clearSale: () => void;
    total: number;
}

export const useSaleStore = create(
    persist<SaleState>(
        (set, get) => ({
            products: [],
            paymentType: "tarjeta",
            paymentDetails: { cashAmount: 0, cardAmount: 0 },
            status: "pendiente",
            addProduct: (newProduct) =>
                set((state) => {
                    const existingIndex = state.products.findIndex(
                        (p) => p.productId.toString() === newProduct.productId.toString()
                    );

                    if (existingIndex !== -1) {
                        const updatedProducts = [...state.products];
                        updatedProducts[existingIndex].quantity += newProduct.quantity;
                        return { products: updatedProducts };
                    } else {
                        return { products: [...state.products, newProduct] };
                    }
                }),

            removeProduct: (productId) =>
                set({
                    products: get().products.filter((p) => p.productId !== productId),
                }),

            updateQuantity: (productId, quantity) =>
                set({
                    products: get().products.map((p) =>
                        p.productId === productId ? { ...p, quantity } : p
                    ),
                }),

            setPaymentType: (type) => set({ paymentType: type }),

            setCashAmount: (amount) =>
                set((state) => ({
                    paymentDetails: { ...state.paymentDetails, cashAmount: amount },
                })),

            setCardAmount: (amount) =>
                set((state) => ({
                    paymentDetails: { ...state.paymentDetails, cardAmount: amount },
                })),

            setStatus: (status) => set({ status }),

            clearSale: () =>
                set({
                    products: [],
                    paymentType: "tarjeta",
                    paymentDetails: { cashAmount: 0, cardAmount: 0 },
                    status: "pendiente",
                }),

            total: 0,
        }),
        {
            name: "sale-storage",
            partialize: (state) => ({
                products: state.products,
                paymentType: state.paymentType,
                paymentDetails: state.paymentDetails,
                status: state.status,
            }),
        }
    )
);