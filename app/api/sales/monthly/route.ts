/* eslint-disable @typescript-eslint/no-explicit-any */
import Restaurant from "@/models/restaurant";
import "@/models/total-sales";
import "@/models/sale";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";

export async function POST(req: NextRequest) {
    const { page = 1, limit = 12 } = await req.json();
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token?.id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        await connectToDatabase();

        const restaurant = await Restaurant.findById(token.id).populate({
            path: "restaurantSales",
            populate: { path: "sales" },
        });

        const sales = restaurant?.restaurantSales || [];

        // Agrupar por mes
        const monthlyTotals: Record<string, any> = {};

        sales.forEach((sale: any) => {
            const date = new Date(sale.date);
            const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1)
                .toString()
                .padStart(2, "0")}`;

            if (!monthlyTotals[monthKey]) {
                monthlyTotals[monthKey] = {
                    month: monthKey,
                    total: 0,
                    efectivo: 0,
                    tarjeta: 0,
                };
            }

            monthlyTotals[monthKey].total += sale.totalAmount;

            sale.sales?.forEach((s: any) => {
                if (s.paymentType === "efectivo") monthlyTotals[monthKey].efectivo += s.total;
                else if (s.paymentType === "tarjeta") monthlyTotals[monthKey].tarjeta += s.total;
                else if (s.paymentType === "dividido") {
                    monthlyTotals[monthKey].efectivo += s.paymentDetails?.cashAmount || 0;
                    monthlyTotals[monthKey].tarjeta += s.paymentDetails?.cardAmount || 0;
                }
            });
        });

        // Convertimos a array y ordenamos DESC (último mes primero)
        const allMonths = Object.values(monthlyTotals).sort((a, b) =>
            b.month.localeCompare(a.month)
        );

        // Paginación
        const totalPage = Math.ceil(allMonths.length / limit);
        const start = (page - 1) * limit;
        const paginatedMonths = allMonths.slice(start, start + limit);


        return NextResponse.json({
            items: paginatedMonths,
            totalPage,
        });
    } catch (error) {
        console.error("Error al obtener totales por mes", error);
        return NextResponse.json({ message: "Error del servidor" }, { status: 500 });
    }
}
