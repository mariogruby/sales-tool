// getByNumber/route.ts
import Table from "@/models/table";
import Restaurant from "@/models/restaurant";
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";

export async function POST(request: Request) {
    const { restaurantId, tableNumber } = await request.json();

    if (!restaurantId || !tableNumber) {
        return NextResponse.json(
            { message: "restaurantId y tableNumber son requeridos" },
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

        const table = await Table.findOne({
            restaurant: restaurantId,
            number: tableNumber,
        }).populate("products"); // ✅ Popula los productos

        if (!table) {
            return NextResponse.json(
                { message: `Mesa número ${tableNumber} no encontrada` },
                { status: 404 }
            );
        }

        return NextResponse.json({ table }, { status: 200 });
    } catch (error) {
        console.error("Error al buscar la mesa:", error);
        return NextResponse.json(
            { message: "Error interno del servidor" },
            { status: 500 }
        );
    }
}
