/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Restaurant from "@/models/restaurant";
import DailySales from "@/models/daily-sales";
import "@/models/total-sales";

export async function POST(request: Request) {
    const { restaurantId } = await request.json();

    try {
        await connectToDatabase();

        const now = new Date();
        const startOfDay = new Date(now);
        startOfDay.setHours(0, 0, 0, 0);
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfYear = new Date(now.getFullYear(), 0, 1);

        // Cargar restaurante con ventas cerradas (TotalSales)
        const restaurant = await Restaurant.findById(restaurantId).populate("restaurantSales");

        if (!restaurant) {
            return NextResponse.json({ message: "Restaurante no encontrado" }, { status: 404 });
        }

        const sales = restaurant.restaurantSales;

        // Función para filtrar y sumar ventas cerradas
        const filterAndSum = (startDate: Date) => {
            return sales
                .filter((sale: any) => new Date(sale.date) >= startDate)
                .reduce((acc: number, sale: any) => acc + sale.totalAmount, 0);
        };

        // ✅ Ventas cerradas
        const totalMonth = filterAndSum(startOfMonth);
        const totalYear = filterAndSum(startOfYear);

        // ✅ Ventas del día (solo si no está cerrado)
        const todaySales = await DailySales.findOne({
            restaurant: restaurantId,
            isClosed: false
        }).sort({ date: -1 }); // por si acaso

        const totalDay = todaySales ? todaySales.totalAmount : 0;


        return NextResponse.json({
            day: totalDay,
            month: totalMonth,
            year: totalYear,
        });
    } catch (error) {
        console.error("Error al obtener el resumen de ventas", error);
        return NextResponse.json({ message: "Error del servidor" }, { status: 500 });
    }
}