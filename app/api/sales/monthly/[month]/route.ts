/* eslint-disable @typescript-eslint/no-unused-vars */
import Restaurant from "@/models/restaurant";
import TotalSales from "@/models/total-sales";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";

export async function POST(req: NextRequest) {
    const { month, page = 1, limit = 10 } = await req.json();

    if (!month) {
        return NextResponse.json({ message: "Debe enviar el mes" }, { status: 400 });
    }

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token?.id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const restaurantId = token.id;

    try {
        await connectToDatabase();

        const skip = (page - 1) * limit;

        const [year, monthNumber] = month.split("-").map(Number);
        if (!year || !monthNumber) {
            return NextResponse.json(
                { message: "Formato de mes inválido. Usa YYYY-MM" },
                { status: 400 }
            );
        }

        const startDate = new Date(year, monthNumber - 1, 1);
        const endDate = new Date(year, monthNumber, 1);

        const totalCount = await TotalSales.countDocuments({
            restaurant: restaurantId,
            date: { $gte: startDate, $lt: endDate },
        });

        const sales = await TotalSales.find({
            restaurant: restaurantId,
            date: { $gte: startDate, $lt: endDate },
        })
            .sort({ date: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        return NextResponse.json({
            sales,
            totalCount,
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit),
        });
    } catch (error) {
        console.error("Error al obtener ventas del mes:", error);
        return NextResponse.json({ message: "Error del servidor" }, { status: 500 });
    }
}
