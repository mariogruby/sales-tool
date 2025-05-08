import { create } from "zustand"
import { ICategory } from "@/types/category"

interface CategoryStore {
    categories: ICategory[]
    loading: boolean
    error: string
    selectedCategoryId?: string
    setCategories: (categories: ICategory[]) => void
    addCategory: (category: ICategory) => void
    setLoading: (loading: boolean) => void
    setError: (error: string) => void
    setSelectedCategoryId: (id: string | undefined) => void
}

export const useCategoryStore = create<CategoryStore>((set) => ({
    categories: [],
    loading: false,
    error: "",
    selectedCategoryId: undefined,
    setCategories: (categories) => set({ categories }),
    addCategory: (category) =>
        set((state) => ({
            categories: [category, ...state.categories],
        })),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
    setSelectedCategoryId: (id) => set({ selectedCategoryId: id }),
}))
