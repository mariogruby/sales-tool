/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Sale from "@/models/sale";
import Product from "@/models/product";
import { Types } from "mongoose";

export async function POST(request: Request) {
    const { products, status, paymentType, total } = await request.json();

    if (!products || products.length === 0 || !total) {
        return NextResponse.json(
            { message: "Products and total are required" },
            { status: 400 }
        );
    }

    try {
        await connectToDatabase();

        // Validar que todos los productos existan
        for (const item of products) {
            if (
                !item.productId ||
                !Types.ObjectId.isValid(item.productId) ||
                typeof item.quantity !== "number" ||
                typeof item.price !== "number"
            ) {
                return NextResponse.json(
                    { message: "Invalid product data" },
                    { status: 400 }
                );
            }

            const productExists = await Product.findById(item.productId);
            if (!productExists) {
                return NextResponse.json(
                    { message: `Product not found: ${item.productId}` },
                    { status: 404 }
                );
            }
        }

        // Crear la venta
        const newSale = new Sale({
            products: products.map((p: any) => ({
                productId: p.productId,
                quantity: p.quantity,
                price: p.price
            })),
            status: status || "pendiente",
            paymentType: paymentType || "tarjeta",
            total,
            createdAt: new Date()
        });

        const savedSale = await newSale.save();

        return NextResponse.json(
            { sale: savedSale },
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
