/* eslint-disable @typescript-eslint/no-explicit-any */
import Table from "@/models/table";
import { Types } from "mongoose";
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";

export async function PUT(request: Request) {
    const { restaurantId, tableNumber, products } = await request.json();

    if (!restaurantId || !tableNumber || !Array.isArray(products)) {
        return NextResponse.json(
            { message: "Faltan datos requeridos" },
            { status: 400 }
        );
    }

    try {
        await connectToDatabase();

        // Buscar la mesa directamente
        const table = await Table.findOne({
            restaurant: restaurantId,
            number: tableNumber,
        });

        if (!table) {
            return NextResponse.json({ error: "Mesa no encontrada" }, { status: 404 });
        }

        // Formatear productos y manejar duplicados
        const formattedProducts = products.map((p: any) => ({
            productId: new Types.ObjectId(p.productId),
            name: p.name,
            price: p.price,
            quantity: p.quantity,
        }));

        // Procesar cada producto
        formattedProducts.forEach((newProduct: any) => {
            // Buscar si el producto ya existe en la mesa
            const existingProduct = table.products.find(
                (p: any) => p.productId.toString() === newProduct.productId.toString()
            );

            if (existingProduct) {
                // Si existe, sumar la cantidad
                existingProduct.quantity += newProduct.quantity;
            } else {
                // Si no existe, agregar el nuevo producto
                table.products.push(newProduct);
            }
        });

        if (!table.isOccupied) {
            table.isOccupied = true;
        }
        await table.save();

        return NextResponse.json({ message: "Productos agregados correctamente" });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
    }
}