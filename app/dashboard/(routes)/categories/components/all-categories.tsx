import { ICategory } from "@/types/category"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface AllCategoriesProps {
    categories: ICategory[];
    loading: boolean;
    error: string;
    onSelect?: (value: string) => void;
}

export function AllCategories({ categories, loading, error, onSelect }: AllCategoriesProps) {
    if (loading) return <div className="p-4">Cargando categorías...</div>;
    if (error) return <div className="p-4 text-red-500">{error}</div>;

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
};

