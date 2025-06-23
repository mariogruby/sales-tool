import Table from "@/models/table";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";

export async function PUT(req: NextRequest) {
  const { tableNumber, products } = await req.json();

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const restaurantId = token.id

  if (!tableNumber || !Array.isArray(products)) {
    return NextResponse.json({ message: "Faltan datos requeridos" }, { status: 400 });
  }

  try {
    await connectToDatabase();

    const table = await Table.findOne({ restaurant: restaurantId, number: tableNumber });
    if (!table) return NextResponse.json({ message: "Mesa no encontrada" }, { status: 404 });

    table.products = products;
    await table.save();

    return NextResponse.json({ message: "Productos de mesa actualizados" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error en server" }, { status: 500 });
  }
}
