import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import DailySales from "@/models/daily-sales";
import TotalSales from "@/models/total-sales";
import Restaurant from "@/models/restaurant";

export async function POST(request: Request) {
    const { restaurantId } = await request.json();

    try {
        await connectToDatabase()

        const now = new Date();
        const startOfWorkDay = new Date(now);
        startOfWorkDay.setHours(6, 0, 0, 0); // día laboral empieza a las 6:00 am

        // Si ya pasó la medianoche pero es antes de las 6 am, restamos un día
        if (now.getHours() < 6) {
            startOfWorkDay.setDate(startOfWorkDay.getDate() - 1);
        }

        const endOfWorkDay = new Date(startOfWorkDay);
        endOfWorkDay.setDate(endOfWorkDay.getDate() + 1);
        endOfWorkDay.setHours(5, 59, 59, 999); // termina justo antes de las 6:00 am del día siguiente


        const dailySales = await DailySales.findOne({
            date: { $gte: startOfWorkDay, $lte: endOfWorkDay },
            isClosed: false
        });

        if (!dailySales) {
            return NextResponse.json({ message: "No open daily sales found" }, { status: 404 })
        }

        const totalSales = new TotalSales({
            date: startOfWorkDay,
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