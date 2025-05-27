import { NextResponse } from "next/server";
import Table from "@/models/table";
import connectToDatabase from '@/lib/mongodb';
import Restaurant from "@/models/restaurant";

export async function POST(request: Request) {
    const { tables, restaurantId } = await request.json();

    if (!restaurantId || !Array.isArray(tables) || tables.length === 0) {
        return NextResponse.json({ message: "Missing restaurantId or tables" }, { status: 400 });
    }

    try {
        await connectToDatabase();

        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
            return NextResponse.json({ message: "Restaurant not found" }, { status: 404 });
        }

        // Validar mesas
        for (const table of tables) {
            if (!table.number || !table.location) {
                return NextResponse.json(
                    { message: "All fields are required in every table" },
                    { status: 400 }
                );
            }

            const existingTable = await Table.findOne({ number: table.number, restaurant: restaurantId });
            if (existingTable) {
                return NextResponse.json(
                    { message: `Table number ${table.number} already exists in this restaurant` },
                    { status: 400 }
                );
            }
        }

        const createdTables = await Table.insertMany(
            tables.map(({ number, location }) => ({
                number,
                location,
                restaurant: restaurantId,
            }))
        );

        return NextResponse.json({ tables: createdTables }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}
