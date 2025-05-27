/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Sale from "@/models/sale";
import Product from "@/models/product";
import DailySales from "@/models/daily-sales";
import { Types } from "mongoose";
import Restaurant from "@/models/restaurant";

export async function POST(request: Request) {
    const { products, status, paymentType, paymentDetails, total, restaurantId } = await request.json();

    if (!products || products.length === 0 || !total || !restaurantId) {
        return NextResponse.json(
            { message: "Products and total are required" },
            { status: 400 }
        );
    }

    // Validar pago dividido
    if (paymentType === "dividido" && (!paymentDetails || paymentDetails.cashAmount + paymentDetails.cardAmount !== total)) {
        return NextResponse.json(
            { message: "La suma de efectivo y tarjeta debe ser igual al total" },
            { status: 400 }
        );
    }

    try {
        await connectToDatabase();

        const restaurant = await Restaurant.findById(restaurantId);

        if (!restaurant) {
            return NextResponse.json(
                { message: "Restaurante no encontrado" },
                { status: 404 }
            );
        }

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
                price: p.price,
            })),
            status: status || "pendiente",
            paymentType,
            paymentDetails: paymentType === "dividido" ? paymentDetails : undefined,
            total,
            createdAt: new Date(),
        });

        const savedSale = await newSale.save();

        // -------------------------------
        // AGREGAR A DAILY SALES
        // -------------------------------
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        let dailySales = await DailySales.findOne({
            date: { $gte: startOfDay, $lte: endOfDay },
            isClosed: false,
        });

        if (!dailySales) {
            dailySales = new DailySales({
                date: new Date(),
                sales: [savedSale._id],
                totalAmount: savedSale.total,
                saleCount: 1,
                restaurant: restaurant,
            });
        } else {
            dailySales.sales.push(savedSale._id);
            dailySales.totalAmount += savedSale.total;
            dailySales.saleCount += 1;
        }

        await dailySales.save();
        // -------------------------------

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