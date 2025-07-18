/* eslint-disable @typescript-eslint/no-explicit-any */
import Table from "@/models/table";
import Sale from "@/models/sale";
import DailySales from "@/models/daily-sales";
import Restaurant from "@/models/restaurant";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  const { tableNumber, status, paymentType, paymentDetails } = await req.json();

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const restaurantId = token.id

  if (!tableNumber) {
    return NextResponse.json({ message: "falta Número de mesa" }, { status: 400 });
  }

  try {
    await connectToDatabase();

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return NextResponse.json({ message: "Restaurante no encontrado" }, { status: 404 });
    }

    const table = await Table.findOne({ restaurant: restaurantId, number: tableNumber });
    if (!table) {
      return NextResponse.json({ message: "Mesa no encontrada" }, { status: 404 });
    }

    if (!table.products || table.products.length === 0) {
      return NextResponse.json({ message: "La mesa no tiene productos para vender" }, { status: 400 });
    }

    // Calcular total
    const total = table.products.reduce((sum, p) => sum + p.price * p.quantity, 0);

    // Validar pago dividido si aplica
    if (paymentType === "dividido" && (!paymentDetails || paymentDetails.cashAmount + paymentDetails.cardAmount !== total)) {
      return NextResponse.json(
        { message: "La suma de efectivo y tarjeta debe ser igual al total" },
        { status: 400 }
      );
    }

    let paymentDetailsToSave = { cashAmount: 0, cardAmount: 0 };

    if (paymentType === "dividido") {
      paymentDetailsToSave = paymentDetails;
    } else if (paymentType === "efectivo") {
      paymentDetailsToSave = { cashAmount: total, cardAmount: 0 };
    } else if (paymentType === "tarjeta") {
      paymentDetailsToSave = { cashAmount: 0, cardAmount: total };
    } else {
      paymentDetailsToSave = { cashAmount: 0, cardAmount: 0 };
    }

    // Crear la venta con productos de la mesa
    const newSale = new Sale({
      products: table.products.map((p: any) => ({
        productId: p.productId,
        quantity: p.quantity,
        price: p.price,
      })),
      status: status || "pendiente",
      paymentType,
      paymentDetails: paymentDetailsToSave,
      total,
      restaurant: restaurantId, // or restaurant, is same
      createdAt: new Date(),
    });

    const savedSale = await newSale.save();

    // Actualizar DailySales igual que en addSale
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
      restaurant: restaurantId,
      isClosed: false
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

    // Limpiar productos de la mesa y marcar libre
    table.products = [];
    table.isOccupied = false;
    await table.save();

    return NextResponse.json({ sale: savedSale }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
  }
}
