import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import DailySales from "@/models/daily-sales";
import TotalSales from "@/models/total-sales";
import Restaurant from "@/models/restaurant";

export async function POST(request: Request) {
    const { restaurantId, dailySalesId } = await request.json();

    try {
        await connectToDatabase();

        let dailySales;

        if (dailySalesId) {
            dailySales = await DailySales.findOne({ _id: dailySalesId, isClosed: false });
        } else {
            const now = new Date();
            const startOfWorkDay = new Date(now);
            startOfWorkDay.setHours(6, 0, 0, 0);

            if (now.getHours() < 6) {
                startOfWorkDay.setDate(startOfWorkDay.getDate() - 1);
            }

            const endOfWorkDay = new Date(startOfWorkDay);
            endOfWorkDay.setDate(endOfWorkDay.getDate() + 1);
            endOfWorkDay.setHours(5, 59, 59, 999);

            dailySales = await DailySales.findOne({
                date: { $gte: startOfWorkDay, $lte: endOfWorkDay },
                isClosed: false,
            });
        }

        if (!dailySales) {
            return NextResponse.json({ message: "No se encontró un día de ventas abierto" }, { status: 404 });
        }

        const totalSales = new TotalSales({
            date: dailySales.date, // usamos la fecha original
            totalAmount: dailySales.totalAmount,
            saleCount: dailySales.saleCount,
            sales: dailySales.sales,
        });

        await totalSales.save();

        dailySales.isClosed = true;
        await dailySales.save();

        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
            return NextResponse.json({ message: "Restaurante no encontrado" }, { status: 400 });
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
