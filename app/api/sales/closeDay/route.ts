import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import DailySales from "@/models/daily-sales";
import TotalSales from "@/models/total-sales";
import Restaurant from "@/models/restaurant";

export async function POST(request: Request) {
    const { restaurantId } = await request.json();

    try {
        await connectToDatabase()

        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0)

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999)

        const dailySales = await DailySales.findOne({
            date: { $gte: startOfDay, $lte: endOfDay },
            isClosed: false
        })

        if (!dailySales) {
            return NextResponse.json({ message: "No open daily sales found" }, { status: 404 })
        }

        const totalSales = new TotalSales({
            date: dailySales.date,
            totalAmount: dailySales.totalAmount,
            saleCount: dailySales.saleCount,
            sales: dailySales.sales
        })

        await totalSales.save()

        dailySales.isClosed = true
        await dailySales.save();

        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
            return NextResponse.json(
                { message: "restaurant ID is required for proceed this step" },
                { status: 400 }
            )
        }

        restaurant.restaurantSales.push(totalSales._id);
        await restaurant.save();

        return NextResponse.json(
            { message: "Día cerrado exitosamente", totalSales },
            { status: 200 }
        );

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Error al cerrar el día" }, { status: 500 });
    }
}