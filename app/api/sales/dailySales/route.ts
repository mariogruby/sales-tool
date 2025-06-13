import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import DailySales from "@/models/daily-sales";
import Sale from "@/models/sale";
import Restaurant from '@/models/restaurant';

export async function POST(request: Request) {
    const { restaurantId, page = 1, limit = 10 } = await request.json();

    try {
        await connectToDatabase();

        const skip = (page - 1) * limit;
        const restaurant = await Restaurant.findById(restaurantId)
        if (!restaurant) {
            return NextResponse.json({ message: "Restaurante no encontrado" }, { status: 404 });
        }

        // Buscar el último documento DailySales para el restaurante dado
        const latestDailySales = await DailySales
        .findOne({ restaurant: restaurantId, isClosed: false })
        .sort({ date: -1 })
        .select('sales');

        if (!latestDailySales) {
            return NextResponse.json({
                sales: [],
                totalCount: 0,
                currentPage: page,
                totalPages: 0,
                message: "No hay ventas registradas aún"
            }, { status: 200 });
        }

        // Obtener las IDs de ventas del DailySales
        const salesIds = latestDailySales.sales;

        // Calcular el total de ventas y aplicar paginación sobre las IDs
        const totalCount = salesIds.length;
        const paginatedIds = salesIds.slice(skip, skip + limit);

        // Obtener los documentos reales de Sale para las IDs paginadas
        const sales = await Sale
            .find({ _id: { $in: paginatedIds } })
            .sort({ createdAt: -1 }) // Ordenar por fecha de creación descendente
            .populate('products.productId') // Poblar los detalles de los productos
            .lean();

        return NextResponse.json({
            sales: sales,
            totalCount,
            currentPage: page,
            totalPage: Math.ceil(totalCount / limit),
        });

    } catch (error) {
        console.error('Error al obtener ventas:', error);
        return NextResponse.json(
            { message: "Error al obtener ventas" },
            { status: 500 }
        );
    }
}