import Table from "@/models/table";
// import Restaurant from "@/models/restaurant";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";

export async function GET(req: NextRequest) {

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token?.id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const restaurantId = token.id

    try {
        await connectToDatabase();
        const tables = await Table.find({ restaurant: restaurantId }).lean()

        return NextResponse.json({ tables }, { status: 200 });

    } catch (error) {
        console.error("Error al obtener mesas:", error);
        return NextResponse.json(
            { message: "Error al obtener las mesas" },
            { status: 500 }
        );
    }
}
