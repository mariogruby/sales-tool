import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useCategoryStore } from "@/zustand/use-categories-store";

interface AllCategoriesProps {
    onSelect?: (value: string) => void;
}

export function AllCategories({ onSelect }: AllCategoriesProps) {
    const { categories, loading } = useCategoryStore();

    if (loading) return <div className="p-4">Cargando categorías...</div>;
    if (!categories.length) return <div className="p-4">No hay categorías disponibles.</div>;

    return (
        <Select onValueChange={onSelect}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Selecciona una categoría" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Categorías</SelectLabel>
                    {categories.map((category) => (
                        <SelectItem key={category._id} value={category._id}>
                            {category.name}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}