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
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const startOfLastYear = new Date(now.getFullYear() - 1, 0, 1);

    const startOfYesterday = new Date(startOfDay);
    startOfYesterday.setDate(startOfDay.getDate() - 1);

    const restaurant = await Restaurant.findById(restaurantId).populate("restaurantSales");

    if (!restaurant) {
      return NextResponse.json({ message: "Restaurante no encontrado" }, { status: 404 });
    }

    const sales = restaurant.restaurantSales;

    const filterAndSum = (startDate: Date, endDate?: Date) => {
      return sales
        .filter((sale: any) => {
          const saleDate = new Date(sale.date);
          return saleDate >= startDate && (!endDate || saleDate < endDate);
        })
        .reduce((acc: number, sale: any) => acc + sale.totalAmount, 0);
    };

    const totalMonth = filterAndSum(startOfMonth);
    const totalLastMonth = filterAndSum(startOfLastMonth, startOfMonth);

    const totalYear = filterAndSum(startOfYear);
    const totalLastYear = filterAndSum(startOfLastYear, startOfYear);

    const todaySales = await DailySales.findOne({
      restaurant: restaurantId,
      isClosed: false,
    }).sort({ date: -1 });

    const totalDay = todaySales ? todaySales.totalAmount : 0;

    const yesterdaySales = await DailySales.findOne({
      restaurant: restaurantId,
      date: {
        $gte: startOfYesterday,
        $lt: startOfDay,
      },
    });

    const totalYesterday = yesterdaySales ? yesterdaySales.totalAmount : 0;

    const calculatePercentageChange = (current: number, previous: number) => {
      if (previous === 0) return current === 0 ? 0 : 100;
      return ((current - previous) / previous) * 100;
    };

    const changeDay = calculatePercentageChange(totalDay, totalYesterday);
    const changeMonth = calculatePercentageChange(totalMonth, totalLastMonth);
    const changeYear = calculatePercentageChange(totalYear, totalLastYear);

    return NextResponse.json({
      day: totalDay,
      month: totalMonth,
      year: totalYear,
      changeDay,
      changeMonth,
      changeYear,
    });
  } catch (error) {
    console.error("Error al obtener el resumen de ventas", error);
    return NextResponse.json({ message: "Error del servidor" }, { status: 500 });
  }
}
