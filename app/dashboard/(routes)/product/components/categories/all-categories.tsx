
import { ICategory } from "@/types/category";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";


interface AllCategoriesProps {
    categories: ICategory[];
    loading: boolean;
    error: string;
    selectedCategory: string;
    onSelectCategory: (categoryId: string) => void;
    showDeleteButton?: boolean; // NUEVO: opcional, por defecto true
}

export function AllCategories({
    categories,
    loading,
    error,
    selectedCategory,
    onSelectCategory,
    showDeleteButton
}: AllCategoriesProps) {

    if (loading) {
        return <div className="p-4">Cargando categorías...</div>;
    }

    if (error) {
        return (
            <div className="p-4">
                <Alert variant="destructive" className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            </div>
        );
    }

    if (categories.length === 0) {
        return (
            <div className="p-4">
                <Alert variant="default" className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    <AlertTitle>No hay categorías creadas</AlertTitle>
                </Alert>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2">
            <Select
                value={selectedCategory || ""}
                onValueChange={(value) => {
                    onSelectCategory(value === "all" ? "" : value);
                }}
            >
                <SelectTrigger className="sm:w-[120px] lg:w-[180px]">
                    <SelectValue placeholder="Categorías" />
                </SelectTrigger>
                <SelectContent className="max-h-54 overflow-auto">
                    <SelectItem className="text-lg" value="all">Todos los productos</SelectItem>
                    {categories.map((category) => (
                        <SelectItem className="text-lg" key={category._id} value={category._id}>
                            {category.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {showDeleteButton && selectedCategory && (
                <>
                    <Button
                        variant="outline"
                        size="icon"
                    >
                        <Trash2 className="w-5 h-5 text-red-500" />
                    </Button>
                </>
            )}
        </div>
    );
}
