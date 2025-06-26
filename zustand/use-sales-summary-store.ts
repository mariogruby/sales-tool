// zustand/use-sales-summary-store.ts
import { create } from "zustand";

interface SalesSummaryStore {
  refetchSummary?: () => void;
  setRefetchSummary: (fn: () => void) => void;
  refetchGraph?: () => void;
  setRefetchGraph: (fn: () => void) => void;
}

export const useSalesSummaryStore = create<SalesSummaryStore>((set) => ({
  refetchSummary: undefined,
  setRefetchSummary: (fn) => set({ refetchSummary: fn }),
  refetchGraph: undefined,
  setRefetchGraph: (fn) => set({ refetchGraph: fn }),
}));
