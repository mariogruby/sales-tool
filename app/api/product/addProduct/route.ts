import Category from "@/models/category";
import Product from "@/models/product";
import Restaurant from "@/models/restaurant";
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";

export async function POST(request: Request) {
    const { name, price, isAvailable, restaurantId, categoryId } = await request.json();

    if (!name || !price || !restaurantId || !categoryId) {
        return NextResponse.json(
            { message: "All fields are required, including restaurantId and categoryId" },
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

        // Verificar que la categoría existe y pertenece al restaurante
        const category = await Category.findById(categoryId);
        if (!category || category.restaurant.toString() !== restaurantId) {
            return NextResponse.json(
                { message: "Category not found or doesn't belong to the restaurant" },
                { status: 404 }
            );
        }

        // Verifica si el restaurante ya tiene registrado ese producto
        const existingProduct = await Product.findOne({ name, restaurant: restaurantId });
        if (existingProduct) {
            return NextResponse.json(
                { message: "Product already exists in this restaurant" },
                { status: 400 }
            );
        }

        // Crear el producto
        const newProduct = new Product({
            name,
            price,
            isAvailable,
            category: categoryId,
            restaurant: restaurantId,
        });

        const savedProduct = await newProduct.save();
        // console.log("saved product:",savedProduct)

        // Actualizar restaurante y categoría en paralelo
        const updateRestaurant = Restaurant.findByIdAndUpdate(
            restaurantId,
            { $push: { products: savedProduct._id } },
            { new: true }
        );

        const updateCategory = Category.findByIdAndUpdate(
            categoryId,
            { $push: { products: savedProduct._id } },
            { new: true }
        );

        await Promise.all([updateRestaurant, updateCategory]);

        return NextResponse.json(
            { product: savedProduct },
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
