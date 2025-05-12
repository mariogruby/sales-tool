import { NextResponse } from "next/server";
import Product from "@/models/product";
// import Category from "@/models/category";
import Restaurant from "@/models/restaurant";
import connectToDatabase from "@/lib/mongodb";

export async function PUT(request: Request) {
    const { productId, name, price, isAvailable, restaurantId, categoryId } = await request.json();

    if (!productId || !name || !price || !restaurantId || !categoryId) {
        return NextResponse.json(
            { message: "All fields are required" },
            { status: 400 }
        );
    }

    try {
        await connectToDatabase();

        // Verificar que el restaurante existe
        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
            return NextResponse.json(
                { message: "Restaurant not found" },
                { status: 404 }
            );
        }

        const product = await Product.findById(productId);
        if (!product) {
            return NextResponse.json(
                { message: "Product not found" },
                { status: 404 }
            );
        }

        if (product.restaurant.toString() !== restaurantId) {
            return NextResponse.json(
                { message: "Product does not belong to the specified restaurant" },
                { status: 403 }
            );
        }

        // Actualizar los campos
        product.name = name;
        product.price = price;
        product.isAvailable = isAvailable;
        product.category = categoryId

        const updatedProduct = await product.save();

        return NextResponse.json(
            { product: updatedProduct },
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
