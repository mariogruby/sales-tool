/* eslint-disable @typescript-eslint/no-explicit-any */
import Restaurant from "@/models/restaurant";
import "@/models/total-sales";
import "@/models/sale";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";

// 🔧 Función que devuelve la "fecha de trabajo" según tu horario (06:00 a 05:59)
function getWorkDay(date: Date) {
  const d = new Date(date);
  if (d.getHours() < 6) {
    d.setDate(d.getDate() - 1);
  }
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

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
    let startDate = new Date();

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

    // Normalizamos al inicio del "día laboral"
    startDate = getWorkDay(startDate);

    // Filtramos las ventas desde esa fecha
    const filteredSales = sales.filter(
      (sale: any) => getWorkDay(new Date(sale.date)) >= startDate
    );

    const data: any[] = [];
    // 🚀 El bucle empieza en el día laboral normalizado
    // eslint-disable-next-line prefer-const
    let currentDate = new Date(startDate);

    while (currentDate <= now) {
      const daySales = filteredSales.filter(
        (sale: any) =>
          getWorkDay(new Date(sale.date)).getTime() ===
          getWorkDay(currentDate).getTime()
      );

      if (daySales.length > 0) {
        let total = 0;
        let efectivo = 0;
        let tarjeta = 0;

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
          date: getWorkDay(currentDate).toISOString(),
          total,
          efectivo,
          tarjeta,
        });
      } else if (currentDate < getWorkDay(now)) {
        data.push({
          date: getWorkDay(currentDate).toISOString(),
          total: 0,
          efectivo: 0,
          tarjeta: 0,
        });
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    // 🔥 Aseguramos que no devuelva días previos al rango
    const cleanData = data.filter(
      (d) => new Date(d.date).getTime() >= startDate.getTime()
    );

    return NextResponse.json(
      cleanData.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      )
    );
  } catch (error) {
    console.error("Error al obtener datos para gráfico", error);
    return NextResponse.json(
      { message: "Error del servidor" },
      { status: 500 }
    );
  }
}
