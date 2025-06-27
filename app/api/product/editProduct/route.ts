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

    const parsedPrice = Number(price);

    if (!productId || !name || parsedPrice === undefined || !categoryId) {
        return NextResponse.json(
            { message: "Todos los campos son requeridos" },
            { status: 400 }
        );
    }


    if (isNaN(parsedPrice)) {
        return NextResponse.json(
            { message: "precio inválido" },
            { status: 400 }
        );
    }

    try {
        await connectToDatabase();

        const restaurant = await Restaurant.findById(token.id).lean();
        if (!restaurant) {
            return NextResponse.json(
                { message: "Restaurant no encontrado" },
                { status: 404 }
            );
        }

        const product = await Product.findById(productId);
        if (!product) {
            return NextResponse.json(
                { message: "Product no encontrado" },
                { status: 404 }
            );
        }

        // ? 
        if (!product.restaurant || product.restaurant.toString() !== token.id) {
            return NextResponse.json(
                { message: "El producto no corresponde al restaurante" },
                { status: 403 }
            );
        }

        product.name = name;
        product.price = parsedPrice;
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
