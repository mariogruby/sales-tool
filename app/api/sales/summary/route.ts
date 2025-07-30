/* eslint-disable @typescript-eslint/no-explicit-any */
import Restaurant from "@/models/restaurant";
import "@/models/sale";
import DailySales from "@/models/daily-sales";
import "@/models/total-sales";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const restaurantId = token.id;

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

    const restaurant = await Restaurant.findById(restaurantId)
    .populate({
      path: "restaurantSales",
      populate: { path: "sales" },
    })
    .lean();  

    const sales = restaurant?.restaurantSales || [];

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
    })
      .populate("sales")
      .sort({ date: -1 })
      .lean();

    const openDays = await DailySales.find({
      restaurant: restaurantId,
      isClosed: false,
    })
      .sort({ date: -1 })
      .lean();

    const totalDay = todaySales ? todaySales.totalAmount : 0;

    let cashTotal = 0;
    let cardTotal = 0;

    if (todaySales) {
      todaySales.sales.forEach((sale: any) => {
        cashTotal += sale.paymentDetails?.cashAmount || 0;
        cardTotal += sale.paymentDetails?.cardAmount || 0;
      });
    }

    // Totales de efectivo y tarjeta en el mes
    let cashTotalMonth = 0;
    let cardTotalMonth = 0;

    const salesThisMonth = restaurant?.restaurantSales || [];

    salesThisMonth
      .filter((totalSale: any) => {
        const saleDate = new Date(totalSale.date);
        return saleDate >= startOfMonth;
      })
      .forEach((totalSale: any) => {
        totalSale.sales?.forEach((sale: any) => {
          cashTotalMonth += sale.paymentDetails?.cashAmount || 0;
          cardTotalMonth += sale.paymentDetails?.cardAmount || 0;
        });
      });

    const yesterdaySales = await DailySales.findOne({
      restaurant: restaurantId,
      date: {
        $gte: startOfYesterday,
        $lt: startOfDay,
      },
    }).lean();

    const totalYesterday = yesterdaySales ? yesterdaySales.totalAmount : 0;

    const calculatePercentageChange = (current: number, previous: number) => {
      if (previous === 0) return current === 0 ? 0 : 100;
      return ((current - previous) / previous) * 100;
    };

    const recentSales = [...sales]
      .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10);

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
