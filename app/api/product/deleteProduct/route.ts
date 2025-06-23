import Product from "@/models/product";
import Category from "@/models/category";
import Restaurant from "@/models/restaurant";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";

export async function DELETE(req: NextRequest) {
    const { productId } = await req.json();

    if (!productId) {
        return NextResponse.json(
            { message: "Product ID is required" },
            { status: 400 }
        );
    }

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token?.id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        await connectToDatabase();

        const product = await Product.findById(productId);
        if (!product) {
            return NextResponse.json(
                { message: "Product not found" },
                { status: 404 }
            );
        }

        if (product.restaurant.toString() !== token.id) {
            return NextResponse.json(
                { message: "Product does not belong to your restaurant" },
                { status: 403 }
            );
        }

        const categories = await Category.find({ products: productId });

        await Product.findByIdAndDelete(productId);

        await Restaurant.findByIdAndUpdate(token.id, {
            $pull: { products: productId },
        });

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

