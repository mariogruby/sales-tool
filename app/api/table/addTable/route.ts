import Table from "@/models/table";
import Restaurant from "@/models/restaurant";
import { NextResponse } from "next/server";
import connectToDatabase from '@/lib/mongodb';

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

        // Obtener el número más alto de mesa existente
        const maxTable = await Table.findOne({ restaurant: restaurantId }).sort({ number: -1 });
        // eslint-disable-next-line prefer-const
        let nextNumber = maxTable ? maxTable.number + 1 : 1;

        // Validar mesas y asignar números automáticamente
        const tablesToCreate = tables.map((table, index) => {
            if (!table.location) {
                throw new Error("All fields are required in every table");
            }
            return {
                number: nextNumber + index,
                location: table.location,
                restaurant: restaurantId,
            };
        });

        const createdTables = await Table.insertMany(tablesToCreate);

        return NextResponse.json({ tables: createdTables }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message:"Something went wrong" }, { status: 500 });
    }
}