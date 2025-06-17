import Sale from "@/models/sale";
import DailySales from "@/models/daily-sales";
import Restaurant from "@/models/restaurant";
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";

export async function POST(request: Request) {
    const { restaurantId, paymentDetails } = await request.json();

    if (!restaurantId) {
        return NextResponse.json(
            { message: "restaurantId es requerido" },
            { status: 400 }
        );
    }

    if (
        !paymentDetails ||
        typeof paymentDetails.cashAmount !== "number" ||
        typeof paymentDetails.cardAmount !== "number" ||
        (paymentDetails.cashAmount < 0 || paymentDetails.cardAmount < 0)
    ) {
        return NextResponse.json(
            { message: "paymentDetails debe incluir cashAmount y cardAmount válidos" },
            { status: 400 }
        );
    }

    const total = paymentDetails.cashAmount + paymentDetails.cardAmount;

    if (total === 0) {
        return NextResponse.json(
            { message: "El total no puede ser 0" },
            { status: 400 }
        );
    }

    // Determinar paymentType
    let paymentType: "efectivo" | "tarjeta" | "dividido" = "dividido";
    if (paymentDetails.cashAmount === 0 && paymentDetails.cardAmount > 0) {
        paymentType = "tarjeta";
    } else if (paymentDetails.cardAmount === 0 && paymentDetails.cashAmount > 0) {
        paymentType = "efectivo";
    }

    try {
        await connectToDatabase();

        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
            return NextResponse.json(
                { message: "Restaurante no encontrado" },
                { status: 404 }
            );
        }

        const newSale = new Sale({
            products: [], // Sin productos específicos
            status: "pagado",
            paymentType,
            paymentDetails,
            total,
            createdAt: new Date(),
        });

        const savedSale = await newSale.save();

        // Actualizar DailySales
        const now = new Date();
        const startOfWorkDay = new Date(now);
        startOfWorkDay.setHours(6, 0, 0, 0);

        if (now.getHours() < 6) {
            startOfWorkDay.setDate(startOfWorkDay.getDate() - 1);
        }

        const endOfWorkDay = new Date(startOfWorkDay);
        endOfWorkDay.setDate(endOfWorkDay.getDate() + 1);
        endOfWorkDay.setHours(5, 59, 59, 999);

        let dailySales = await DailySales.findOne({
            date: { $gte: startOfWorkDay, $lte: endOfWorkDay },
            isClosed: false,
        });

        if (!dailySales) {
            dailySales = new DailySales({
                date: startOfWorkDay,
                sales: [savedSale._id],
                totalAmount: savedSale.total,
                saleCount: 1,
                restaurant: restaurant,
            });
        } else {
            dailySales.sales.push(savedSale._id);
            dailySales.totalAmount += savedSale.total;
            dailySales.saleCount += 1;
        }

        await dailySales.save();

        return NextResponse.json({ sale: savedSale }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Algo salió mal" }, { status: 500 });
    }
}
