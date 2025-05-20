/* eslint-disable @typescript-eslint/no-explicit-any */
import connectToDatabase from "@/lib/mongodb";
import Restaurant from "@/models/restaurant";
import { NextResponse } from "next/server";
import "@/models/total-sales";
import "@/models/sale"; 

export async function POST(request: Request) {
  const { restaurantId, timeRange } = await request.json();

  try {
    await connectToDatabase();

    const restaurant = await Restaurant.findById(restaurantId)
      .populate({
        path: "restaurantSales",
        populate: { path: "sales" }, // <-- asume que cada total sale tiene un array de ventas
      });

    if (!restaurant) {
      return NextResponse.json({ message: "Restaurante no encontrado" }, { status: 404 });
    }

    const sales = restaurant.restaurantSales || [];

    const now = new Date();
    const startDate = new Date();
    switch (timeRange) {
      case "7d":
        startDate.setDate(now.getDate() - 7);
        break;
      case "30d":
        startDate.setDate(now.getDate() - 30);
        break;
      case "90d":
      default:
        startDate.setDate(now.getDate() - 90);
        break;
    }

    const filteredSales = sales.filter((sale: any) => new Date(sale.date) >= startDate);

    const data = filteredSales.map((sale: any) => {
      const efectivo = sale.sales
        ?.filter((s: any) => s.paymentType === "efectivo")
        .reduce((acc: number, curr: any) => acc + curr.total, 0) || 0;

      const tarjeta = sale.sales
        ?.filter((s: any) => s.paymentType === "tarjeta")
        .reduce((acc: number, curr: any) => acc + curr.total, 0) || 0;

      return {
        date: sale.date.toISOString(),
        total: sale.totalAmount,
        efectivo,
        tarjeta,
      };
    });

    return NextResponse.json(data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
  } catch (error) {
    console.error("Error al obtener datos para gráfico", error);
    return NextResponse.json({ message: "Error del servidor" }, { status: 500 });
  }
}
