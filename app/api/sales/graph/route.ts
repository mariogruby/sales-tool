/* eslint-disable @typescript-eslint/no-explicit-any */
import Restaurant from "@/models/restaurant";
import "@/models/total-sales";
import "@/models/sale";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  const { timeRange } = await req.json();

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

    // Filtramos solo las ventas dentro del rango
    const filteredSales = sales.filter(
      (sale: any) => new Date(sale.date) >= startDate
    );

    const data: any[] = [];
    const currentDate = new Date(startDate);

    while (currentDate <= now) {
      // Buscamos todos los cierres del día
      const daySales = filteredSales.filter(
        (sale: any) =>
          new Date(sale.date).toDateString() === currentDate.toDateString()
      );

      if (daySales.length > 0) {
        let total = 0;
        let efectivo = 0;
        let tarjeta = 0;

        // Sumamos todos los cierres del día
        daySales.forEach((daySale: any) => {
          total += daySale.totalAmount;

          daySale.sales?.forEach((s: any) => {
            if (s.paymentType === "efectivo") efectivo += s.total;
            else if (s.paymentType === "tarjeta") tarjeta += s.total;
            else if (s.paymentType === "dividido") {
              efectivo += s.paymentDetails?.cashAmount || 0;
              tarjeta += s.paymentDetails?.cardAmount || 0;
            }
          });
        });

        data.push({
          date: currentDate.toISOString(),
          total,
          efectivo,
          tarjeta,
        });
      } else if (currentDate < new Date(now.toDateString())) {
        // Día pasado sin ventas
        data.push({
          date: currentDate.toISOString(),
          total: 0,
          efectivo: 0,
          tarjeta: 0,
        });
      }
      // Si es hoy y no hay ventas, no agregamos nada

      currentDate.setDate(currentDate.getDate() + 1);
    }

    // console.log("📊 Datos filtrados:", {
    //   timeRange,
    //   startDate,
    //   endDate: now,
    //   registros: data.length,
    //   data,
    // });

    return NextResponse.json(
      data.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      )
    );
  } catch (error) {
    console.error("Error al obtener datos para gráfico", error);
    return NextResponse.json({ message: "Error del servidor" }, { status: 500 });
  }
}
