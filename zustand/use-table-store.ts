import { create } from "zustand";
import { TableClient, TableProductClient } from "@/types/table-client";

interface TableState {
  tables: TableClient[];
  setTables: (tables: TableClient[]) => void;
  tableNumber: number | null;
  products: TableProductClient[];
  setTable: (tableNumber: number, products: TableProductClient[]) => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  removeProduct: (id: string) => void;
  removeTable: (tableNumber: number) => void;
  reset: () => void;
  refetchTables?: () => void;
  setRefetchTables: (fn: () => void) => void;
}

export const useTableStore = create<TableState>((set) => ({
  tables: [],
  setTables: (tables) => set({ tables }),
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
  removeTable: (tableNumber) =>
    set((state) => ({
      tables: state.tables.filter((table) => table.number !== tableNumber)
    })),
  reset: () =>
    set({ tableNumber: null, products: [] }),
  refetchTables: undefined,
  setRefetchTables: (fn) => set({ refetchTables: fn }),
}));
