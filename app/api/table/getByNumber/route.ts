import Table from "@/models/table";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";

export async function POST(req: NextRequest) {
    const { tableNumber } = await req.json();

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token?.id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!tableNumber) {
        return NextResponse.json(
            { message: "Numero de mesa es requerido" },
            { status: 400 }
        );
    }

    const restaurantId = token.id

    try {
        await connectToDatabase();

        const table = await Table.findOne({
            restaurant: restaurantId,
            number: tableNumber,
        })
        .populate("products")
        .lean();

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
