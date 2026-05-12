import Sale from "@/models/sale";
import { Types } from "mongoose";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";

const SIX_HOURS_MS = 6 * 60 * 60 * 1000;

export async function POST(req: NextRequest) {
    const { timeRange } = await req.json();

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token?.id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        await connectToDatabase();

        const now = new Date();
        const startDate = new Date(now);

        switch (timeRange) {
            case "7d":
                startDate.setDate(now.getDate() - 7);
                break;
            case "14d":
                startDate.setDate(now.getDate() - 14);
                break;
            case "30d":
                startDate.setDate(now.getDate() - 30);
                break;
            case "180d":
                startDate.setDate(now.getDate() - 180);
                break;
            case "365d":
                startDate.setDate(now.getDate() - 365);
                break;
            default:
                startDate.setDate(now.getDate() - 90);
        }
        startDate.setHours(0, 0, 0, 0);

        const chartData = await Sale.aggregate([
            {
                $match: {
                    restaurant: new Types.ObjectId(token.id),
                    createdAt: { $gte: new Date(startDate.getTime() - SIX_HOURS_MS) },
                },
            },
            {
                $addFields: {
                    workDay: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: { $subtract: ["$createdAt", SIX_HOURS_MS] },
                        },
                    },
                },
            },
            {
                $group: {
                    _id: "$workDay",
                    total: { $sum: "$total" },
                    efectivo: {
                        $sum: {
                            $switch: {
                                branches: [
                                    { case: { $eq: ["$paymentType", "efectivo"] }, then: "$total" },
                                    { case: { $eq: ["$paymentType", "dividido"] }, then: { $ifNull: ["$paymentDetails.cashAmount", 0] } },
                                ],
                                default: 0,
                            },
                        },
                    },
                    tarjeta: {
                        $sum: {
                            $switch: {
                                branches: [
                                    { case: { $eq: ["$paymentType", "tarjeta"] }, then: "$total" },
                                    { case: { $eq: ["$paymentType", "dividido"] }, then: { $ifNull: ["$paymentDetails.cardAmount", 0] } },
                                ],
                                default: 0,
                            },
                        },
                    },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        return NextResponse.json(
            chartData.map((d) => ({
                date: d._id,
                total: d.total,
                efectivo: d.efectivo,
                tarjeta: d.tarjeta,
            }))
        );
    } catch (error) {
        console.error("Error al obtener datos para gráfico", error);
        return NextResponse.json({ message: "Error del servidor" }, { status: 500 });
    }
}
