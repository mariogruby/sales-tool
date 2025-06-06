import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Table from "@/models/table";
import Restaurant from "@/models/restaurant";

export async function POST(request: Request) {
    const { restaurantId } = await request.json();

    const restaurant = await Restaurant.findById(restaurantId);

    if (!restaurant) {
        return NextResponse.json({ message: "Restaurant not found" }, { status: 404 });
    }

    try {
        await connectToDatabase();
        const tables = await Table.find({ restaurant: restaurantId })
        return NextResponse.json(
            { tables },
            { status: 200 }
        );

    } catch (error) {
        console.error("Error al obtener mesas:", error);
        return NextResponse.json(
            { message: "Error al obtener las mesas" },
            { status: 500 }
        );
    }
}
