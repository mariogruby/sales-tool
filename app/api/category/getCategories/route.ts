import { NextResponse } from "next/server";
import "@/models/product";
import Category from "@/models/category";
import connectToDatabase from "@/lib/mongodb";

export async function POST(request: Request) {
    const { restaurantId } = await request.json();

    if (!restaurantId) {
        return NextResponse.json(
            { message: "restaurantId is required" },
            { status: 400 }
        );
    }

    try {
        await connectToDatabase();

        const categories = await Category.find({ restaurant: restaurantId }).populate("products");

        if (!categories || categories.length === 0) {
            return NextResponse.json(
                { message: "No categories found for this restaurant" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { categories },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
