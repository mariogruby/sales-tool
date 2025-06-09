
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Table from "@/models/table";

export async function PUT(request: Request) {
  const { restaurantId, tableNumber, products } = await request.json();

  if (!restaurantId || !tableNumber || !Array.isArray(products)) {
    return NextResponse.json({ message: "Faltan datos requeridos" }, { status: 400 });
  }

  try {
    await connectToDatabase();

    const table = await Table.findOne({ restaurant: restaurantId, number: tableNumber });
    if (!table) return NextResponse.json({ message: "Mesa no encontrada" }, { status: 404 });

    table.products = products;
    await table.save();

    return NextResponse.json({ message: "Productos actualizados" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error interno" }, { status: 500 });
  }
}
