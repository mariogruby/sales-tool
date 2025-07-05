import DailySales from "@/models/daily-sales";
import "@/models/product";
import Sale from "@/models/sale";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";

export async function POST(req: NextRequest) {
    const { page = 1, limit = 10 } = await req.json();

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token?.id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        await connectToDatabase();

        const skip = (page - 1) * limit;

        // Buscar el último documento DailySales abierto
        const latestDailySales = await DailySales
            .findOne({ restaurant: token.id, isClosed: false })
            .sort({ date: -1 })
            .select('sales')
            .lean();

        if (!latestDailySales) {
            return NextResponse.json({
                sales: [],
                totalCount: 0,
                currentPage: page,
                totalPages: 0,
                message: "No hay ventas registradas aún",
            }, { status: 200 });
        }

        // Obtener y ordenar las ventas por fecha descendente
        const fullSales = await Sale
            .find({ _id: { $in: latestDailySales.sales } })
            .sort({ createdAt: -1 })
            .select('_id') // solo obtenemos los IDs ordenados correctamente
            .lean();

        const totalCount = fullSales.length;
        const paginatedIds = fullSales.slice(skip, skip + limit).map(s => s._id);

        // Buscar los detalles de las ventas paginadas
        const sales = await Sale
            .find({ _id: { $in: paginatedIds } })
            .populate('products.productId')
            .lean();

        // Para mantener el orden correcto, hay que reordenar `sales` según `paginatedIds`
        const salesMap = new Map(sales.map(s => [s._id.toString(), s]));
        const orderedSales = paginatedIds.map(id => salesMap.get(id.toString()));

        return NextResponse.json({
            sales: orderedSales,
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
