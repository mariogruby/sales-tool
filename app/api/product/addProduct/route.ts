import Category from "@/models/category";
import Product from "@/models/product";
import Restaurant from "@/models/restaurant";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";

export async function POST(req: NextRequest) {
    const { name, price, isAvailable, categoryId } = await req.json();

    if (!name || price === undefined || !categoryId) {
        return NextResponse.json(
            { message: "All fields are required (name, price, categoryId)" },
            { status: 400 }
        );
    }

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token?.id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        await connectToDatabase();

        const restaurantId = token.id;

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
                { message: "Category not found or doesn't belong to this restaurant" },
                { status: 404 }
            );
        }

        // Verifica si ya existe un producto con ese nombre en este restaurante
        const existingProduct = await Product.findOne({ name, restaurant: restaurantId });
        if (existingProduct) {
            return NextResponse.json(
                { message: "Product already exists in this restaurant" },
                { status: 400 }
            );
        }

        const newProduct = new Product({
            name,
            price,
            isAvailable,
            category: categoryId,
            restaurant: restaurantId,
        });

        const savedProduct = await newProduct.save();

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
