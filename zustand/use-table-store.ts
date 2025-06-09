import { create } from "zustand";

interface Product {
  _id: string;
  name: string;
  price: number;
  quantity: number;
}

interface TableState {
  tableNumber: number | null;
  products: Product[];
  setTable: (tableNumber: number, products: Product[]) => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  removeProduct: (id: string) => void;
  reset: () => void;
}

export const useTableStore = create<TableState>((set) => ({
  tableNumber: null,
  products: [],
  setTable: (tableNumber, products) =>
    set({ tableNumber, products }),
  increaseQuantity: (id) =>
    set((state) => ({
      products: state.products.map((p) =>
        p._id === id ? { ...p, quantity: p.quantity + 1 } : p
      ),
    })),
  decreaseQuantity: (id) =>
    set((state) => ({
      products: state.products
        .map((p) =>
          p._id === id ? { ...p, quantity: p.quantity - 1 } : p
        )
        .filter((p) => p.quantity > 0),
    })),
  removeProduct: (id) =>
    set((state) => ({
      products: state.products.filter((p) => p._id !== id),
    })),
  reset: () =>
    set({ tableNumber: null, products: [] }),
}));
