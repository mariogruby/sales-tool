import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Restaurant from "@/models/restaurant";
import TotalSales from "@/models/total-sales";

export async function POST(request: Request) {
  const { restaurantId, page = 1, limit = 10 } = await request.json();

  try {
    await connectToDatabase();

    const skip = (page - 1) * limit;

    // Buscar el restaurante y obtener solo los IDs de ventas (sin hacer populate aún)
    const restaurant = await Restaurant.findById(restaurantId).select("restaurantSales");
    if (!restaurant) {
      return NextResponse.json({ message: "Restaurante no encontrado" }, { status: 404 });
    }

    // Obtener las IDs de ventas totales y ordenarlas por fecha descendente (más recientes primero)
    const salesIds = restaurant.restaurantSales.slice().reverse();


    const totalCount = salesIds.length;
    const paginatedIds = salesIds.slice(skip, skip + limit);

    // Ahora obtener los documentos reales de TotalSales
    const totalSales = await TotalSales.find({ _id: { $in: paginatedIds } })
      .sort({ date: -1 }); // puedes quitar esto si ya estás ordenando antes, o mantener si no confías en el orden de Mongo

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
