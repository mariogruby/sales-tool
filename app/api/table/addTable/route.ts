import Table from "@/models/table";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from '@/lib/mongodb';

export async function POST(req: NextRequest) {
    const { tables } = await req.json();

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token?.id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const restaurantId = token.id

    if (!Array.isArray(tables) || tables.length === 0) {
        return NextResponse.json({ message: "Missing tables" }, { status: 400 });
    }

    try {
        await connectToDatabase();

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
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}