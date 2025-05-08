import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Product from "@/models/product";
import Category from "@/models/category";
import Restaurant from "@/models/restaurant";

export async function DELETE(request: Request) {
    const { productId } = await request.json();

    if (!productId) {
        return NextResponse.json(
            { message: "Product ID is required" },
            { status: 400 }
        );
    }

    try {
        await connectToDatabase();

        // Verificar que el producto existe
        const product = await Product.findById(productId);
        if (!product) {
            return NextResponse.json(
                { message: "Product not found" },
                { status: 404 }
            );
        }

        const restaurantId = product.restaurant;
        const categories = await Category.find({ products: productId });

        // Eliminar el producto de la colección
        await Product.findByIdAndDelete(productId);

        // Quitar referencia del restaurante
        await Restaurant.findByIdAndUpdate(restaurantId, {
            $pull: { products: productId },
        });

        // Quitar referencia de todas las categorías que tengan ese producto
        const categoryUpdates = categories.map(cat =>
            Category.findByIdAndUpdate(cat._id, {
                $pull: { products: productId },
            })
        );
        await Promise.all(categoryUpdates);

        return NextResponse.json(
            { message: "Product deleted successfully" },
            { status: 200 }
        );

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "Something went wrong" },
            { status: 500 }
        );
    }
}
