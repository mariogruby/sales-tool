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

        // 1. delete products
        await Product.deleteMany({ restaurant: restaurantId });

        // 2. delete total sales
        await TotalSales.deleteMany({ restaurant: restaurantId });

        // 3. delete daily sales
        await DailySales.deleteMany({ restaurant: restaurantId });

        // 4. delete sales
        await Sale.deleteMany({ restaurant: restaurantId });

        // 5. delete tables
        await Table.deleteMany({ restaurant: restaurantId });

        // 6. delete categories
        await Category.deleteMany({ restaurant: restaurantId });

        // 7. DELETE ACCOUNT
        await Restaurant.findByIdAndDelete(restaurantId);

        return NextResponse.json(
            { message: "Restaurant and data deleted" },
            { status: 200 }
        );

    } catch (error) {
        console.error("Error deleting account:", error);
        return NextResponse.json(
            { message: "Something went wrong" },
            { status: 500 }
        );
    }
}
