import { NextResponse } from "next/server";
import "@/models/product";
// console.log("Product model loaded");

import Restaurant from "@/models/restaurant";
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


        const restaurant = await Restaurant.findById(restaurantId).populate("products");

        if (!restaurant) {
            return NextResponse.json(
                { message: "Restaurant not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { products: restaurant.products },
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
