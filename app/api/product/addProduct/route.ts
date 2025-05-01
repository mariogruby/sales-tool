import { NextResponse } from "next/server";
import Product from "@/models/product";
import Restaurant from "@/models/restaurant";
import connectToDatabase from "@/lib/mongodb";

export async function POST(request: Request) {
    const { name, price, isAvailable, restaurantId } = await request.json();

    if (!name || !price || !restaurantId) {
        return NextResponse.json(
            { message: "All fields are required, including restaurantId" },
            { status: 400 }
        );
    }

    try {
        await connectToDatabase();

        // Verificar si el restaurante existe
        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
            return NextResponse.json(
                { message: "Restaurant not found" },
                { status: 404 }
            );
        }

        // Crear el nuevo producto
        const newProduct = new Product({
            name,
            price,
            isAvailable,
        });
        const savedProduct = await newProduct.save();

        // Agregar el ID del producto al array products del restaurante
        restaurant.products.push(savedProduct._id);
        await restaurant.save();

        return NextResponse.json(
            { message: "Product created and added to restaurant" },
            { status: 201 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "Something went wrong" },
            { status: 500 }
        );
    }
}