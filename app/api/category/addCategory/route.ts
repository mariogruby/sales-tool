import { NextResponse } from "next/server";
import Category from "@/models/category";
import Restaurant from "@/models/restaurant";
import connectToDatabase from "@/lib/mongodb";

export async function POST(request: Request) {
    const { name, restaurantId } = await request.json();

    if (!name || !restaurantId) {
        return NextResponse.json(
            { message: "Category name are required" },
            { status: 400 }
        );
    }
    try {
        await connectToDatabase()

        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
            return NextResponse.json(
                { message: "Restaurant not found" },
                { status: 404 }
            );
        }
        const existingCategory = await Category.findOne({ name, restaurant: restaurantId });
        if (existingCategory) {
            return NextResponse.json(
                { message: "Category already exists" },
                { status: 400 }
            );
        }

        const newCategory = new Category({
            name,
            restaurant: restaurantId,
        })
        await newCategory.save()
        return NextResponse.json(
            { message: "Category created", Category: newCategory },
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