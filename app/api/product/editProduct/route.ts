import Product from "@/models/product";
import Restaurant from "@/models/restaurant";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";

export async function PUT(req: NextRequest) {
    const { productId, name, price, isAvailable, categoryId } = await req.json();

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token?.id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!productId || !name || price === undefined || !categoryId) {
        return NextResponse.json(
            { message: "All fields are required" },
            { status: 400 }
        );
    }

    if (typeof price !== "number" || isNaN(price)) {
        return NextResponse.json(
            { message: "Invalid price" },
            { status: 400 }
        );
    }

    try {
        await connectToDatabase();

        const restaurant = await Restaurant.findById(token.id).lean();
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

        if (!product.restaurant || product.restaurant.toString() !== token.id) {
            return NextResponse.json(
                { message: "Product does not belong to the specified restaurant" },
                { status: 403 }
            );
        }

        product.name = name;
        product.price = price;
        product.isAvailable = isAvailable;
        product.category = categoryId;

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
