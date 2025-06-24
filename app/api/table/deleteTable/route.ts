import Table from "@/models/table";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";

export async function DELETE(req: NextRequest) {
    const { tableNumber } = await req.json();

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token?.id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const restaurantId = token.id;

    if (!tableNumber) {
        return NextResponse.json(
            { message: "Missing table number" },
            { status: 400 }
        );
    }

    try {
        await connectToDatabase();

        const deletedTable = await Table.findOneAndDelete({
            number: tableNumber,
            restaurant: restaurantId,
        });

        if (!deletedTable) {
            return NextResponse.json(
                { message: "Table not found or unauthorized" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "Table deleted successfully", table: deletedTable },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting table:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
