import { create } from "zustand";
import { ICategory } from "@/types/category";

interface CategoryStore {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  categories: ICategory[];
  addCategory: (category: ICategory) => void;
  setCategories: (categories: ICategory[]) => void;
  removeCategory: (id: string) => void;
}

export const useCategoryStore = create<CategoryStore>((set) => ({
  selectedCategory: "",
  setSelectedCategory: (category) => set({ selectedCategory: category }),

  categories: [],
  addCategory: (category) => set((state) => ({ categories: [...state.categories, category] })),
  setCategories: (categories) => set({ categories }),
  removeCategory: (id) =>
    set((state) => ({
      categories: state.categories.filter((category) => category._id !== id),
    }))
}));
