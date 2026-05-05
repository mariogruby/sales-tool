import TotalSales from "@/models/total-sales";
import Sale from "@/models/sale";
import DailySales from "@/models/daily-sales";
import { Types } from "mongoose";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";

export async function GET(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token?.id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const restaurantId = new Types.ObjectId(token.id);

    try {
        await connectToDatabase();

        const now = new Date();
        const startOfDay = new Date(now);
        startOfDay.setHours(0, 0, 0, 0);

        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        const startOfLastYear = new Date(now.getFullYear() - 1, 0, 1);
        const startOfYesterday = new Date(startOfDay);
        startOfYesterday.setDate(startOfDay.getDate() - 1);

        const [
            [monthResult],
            [lastMonthResult],
            [yearResult],
            [lastYearResult],
            [paymentMonthResult],
            todaySales,
            openDays,
            yesterdaySales,
            recentSales,
        ] = await Promise.all([
            TotalSales.aggregate([
                { $match: { restaurant: restaurantId, date: { $gte: startOfMonth } } },
                { $group: { _id: null, total: { $sum: "$totalAmount" } } },
            ]),
            TotalSales.aggregate([
                { $match: { restaurant: restaurantId, date: { $gte: startOfLastMonth, $lt: startOfMonth } } },
                { $group: { _id: null, total: { $sum: "$totalAmount" } } },
            ]),
            TotalSales.aggregate([
                { $match: { restaurant: restaurantId, date: { $gte: startOfYear } } },
                { $group: { _id: null, total: { $sum: "$totalAmount" } } },
            ]),
            TotalSales.aggregate([
                { $match: { restaurant: restaurantId, date: { $gte: startOfLastYear, $lt: startOfYear } } },
                { $group: { _id: null, total: { $sum: "$totalAmount" } } },
            ]),
            Sale.aggregate([
                { $match: { restaurant: restaurantId, createdAt: { $gte: startOfMonth } } },
                {
                    $group: {
                        _id: null,
                        cashTotalMonth: { $sum: "$paymentDetails.cashAmount" },
                        cardTotalMonth: { $sum: "$paymentDetails.cardAmount" },
                    },
                },
            ]),
            DailySales.findOne({ restaurant: token.id, isClosed: false })
                .populate("sales")
                .sort({ date: -1 })
                .lean(),
            DailySales.find({ restaurant: token.id, isClosed: false })
                .sort({ date: -1 })
                .lean(),
            DailySales.findOne({
                restaurant: token.id,
                date: { $gte: startOfYesterday, $lt: startOfDay },
            }).lean(),
            TotalSales.find({ restaurant: restaurantId })
                .sort({ date: -1 })
                .limit(10)
                .lean(),
        ]);

        const totalMonth = monthResult?.total ?? 0;
        const totalLastMonth = lastMonthResult?.total ?? 0;
        const totalYear = yearResult?.total ?? 0;
        const totalLastYear = lastYearResult?.total ?? 0;
        const cashTotalMonth = paymentMonthResult?.cashTotalMonth ?? 0;
        const cardTotalMonth = paymentMonthResult?.cardTotalMonth ?? 0;

        const totalDay = todaySales ? todaySales.totalAmount : 0;
        const totalYesterday = yesterdaySales ? yesterdaySales.totalAmount : 0;

        let cashTotal = 0;
        let cardTotal = 0;
        if (todaySales) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (todaySales.sales as any[]).forEach((sale) => {
                cashTotal += sale.paymentDetails?.cashAmount ?? 0;
                cardTotal += sale.paymentDetails?.cardAmount ?? 0;
            });
        }

        const calculatePercentageChange = (current: number, previous: number) => {
            if (previous === 0) return current === 0 ? 0 : 100;
            return ((current - previous) / previous) * 100;
        };

        return NextResponse.json({
            day: totalDay,
            month: totalMonth,
            year: totalYear,
            changeDay: calculatePercentageChange(totalDay, totalYesterday),
            changeMonth: calculatePercentageChange(totalMonth, totalLastMonth),
            changeYear: calculatePercentageChange(totalYear, totalLastYear),
            recentSales,
            openDays,
            cashTotal,
            cardTotal,
            cashTotalMonth,
            cardTotalMonth,
        });
    } catch (error) {
        console.error("Error al obtener el resumen de ventas", error);
        return NextResponse.json({ message: "Error del servidor" }, { status: 500 });
    }
}
