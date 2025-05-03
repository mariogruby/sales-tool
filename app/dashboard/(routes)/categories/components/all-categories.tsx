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
}

export function AllCategories ({ categories, loading, error }: AllCategoriesProps) {
    if (loading) return <div className="p-4">Cargando categorías...</div>;
    if (error) return <div className="p-4 text-red-500">{error}</div>;

    return (
        <Select>
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

