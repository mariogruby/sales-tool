import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

import Restaurant from "@/models/restaurant";
import Product from "@/models/product";
import TotalSales from "@/models/total-sales";
import Table from "@/models/table";
import Sale from "@/models/sale";
import DailySales from "@/models/daily-sales";
import Category from "@/models/category";

import connectToDatabase from "@/lib/mongodb";

export async function DELETE(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token?.id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        await connectToDatabase();

        const restaurantId = token.id;

        // 1. Eliminar productos
        await Product.deleteMany({ restaurant: restaurantId });

        // 2. Eliminar ventas totales
        await TotalSales.deleteMany({ restaurant: restaurantId });

        // 3. Eliminar dailySales
        await DailySales.deleteMany({ restaurant: restaurantId });

        // 4. Eliminar ventas individuales
        await Sale.deleteMany({ restaurant: restaurantId });

        // 5. Eliminar mesas
        await Table.deleteMany({ restaurant: restaurantId });

        // 6. Eliminar categorias
        await Category.deleteMany({ restaurant: restaurantId });

        // 7. ELIMINAR CUENTA
        await Restaurant.findByIdAndDelete(restaurantId);

        return NextResponse.json(
            { message: "Restaurant and related data deleted successfully" },
            { status: 200 }
        );

    } catch (error) {
        console.error("Error deleting restaurant:", error);
        return NextResponse.json(
            { message: "Something went wrong" },
            { status: 500 }
        );
    }
}
