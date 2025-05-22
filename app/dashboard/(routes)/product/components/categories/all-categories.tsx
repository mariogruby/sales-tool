import { ICategory } from "@/types/category"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface AllCategoriesProps {
    categories: ICategory[]
    loading: boolean
    error: string
    selectedCategory: string
    onSelectCategory: (categoryId: string) => void
}

export function AllCategories({
    categories,
    loading,
    error,
    selectedCategory,
    onSelectCategory,
}: AllCategoriesProps) {
    if (loading) {
        return <div className="p-4">Cargando categorías...</div>
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
        )
    }

    return (
        <Select
            value={selectedCategory || ""}
            onValueChange={(value) => {
                onSelectCategory(value === "all" ? "" : value);
            }}
        >
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Selecciona una categoría" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">Todos los productos</SelectItem>
                {categories.map((category) => (
                    <SelectItem key={category._id} value={category._id}>
                        {category.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}
