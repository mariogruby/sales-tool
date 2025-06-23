import Restaurant from "@/models/restaurant";
import TotalSales from "@/models/total-sales";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  const { page = 1, limit = 10 } = await req.json();

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const restaurantId = token.id

  try {
    await connectToDatabase();

    const skip = (page - 1) * limit;

    // Buscar el restaurante y obtener solo los IDs de ventas (sin hacer populate aún)
    const restaurant = await Restaurant.findById(restaurantId).select("restaurantSales").lean();

    // Obtener las IDs de ventas totales y ordenarlas por fecha descendente (más recientes primero)
    const salesIds = restaurant?.restaurantSales?.slice().reverse() || [];

    const totalCount = salesIds.length;
    const paginatedIds = salesIds.slice(skip, skip + limit);

    // Ahora obtener los documentos reales de TotalSales
    const totalSales = await TotalSales.find({ _id: { $in: paginatedIds } })
    .sort({ date: -1 })
    .lean()


    return NextResponse.json({
      sales: totalSales,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
    });
  } catch (error) {
    console.error("Error al obtener ventas totales paginadas", error);
    return NextResponse.json({ message: "Error del servidor" }, { status: 500 });
  }
}
