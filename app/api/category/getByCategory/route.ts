import { NextResponse } from "next/server";
import Category from "@/models/category";
import connectToDatabase from "@/lib/mongodb";

export async function POST(request: Request) {
    const { restaurantId, categoryId } = await request.json();

    if (!categoryId || !restaurantId) {
        return NextResponse.json(
            { message: "categoryId and restaurantId are required" },
            { status: 400 }
        );
    }

    try {
        await connectToDatabase();

        const category = await Category.findOne({
            _id: categoryId,
            restaurant: restaurantId,
        }).populate("products");

        if (!category) {
            return NextResponse.json(
                { message: "Category not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ products: category.products }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
