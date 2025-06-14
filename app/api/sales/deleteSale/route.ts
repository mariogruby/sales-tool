import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Sale from "@/models/sale";
import DailySales from "@/models/daily-sales";
import Restaurant from "@/models/restaurant";

export async function DELETE(request: Request) {
    const { saleId, restaurantId } = await request.json();

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
        return NextResponse.json(
            { message: "Restaurant not found" },
            { status: 404 }
        );
    }

    try {
        await connectToDatabase();

        const sale = await Sale.findById(saleId);
        if (!sale) {
            return NextResponse.json(
                { message: "Sale not found" },
                { status: 404 }
            );
        }

        // Buscar DailySales que contenga la sale
        const dailySales = await DailySales.findOne({
            restaurant: restaurantId,
            sales: saleId,
        });

        if (!dailySales) {
            return NextResponse.json(
                { message: "DailySales entry not found for this sale" },
                { status: 404 }
            );
        }

        // Eliminar la venta y actualizar DailySales en paralelo
        await Promise.all([
            Sale.findByIdAndDelete(saleId),
            DailySales.findByIdAndUpdate(
                dailySales._id,
                {
                    $pull: { sales: saleId },
                    $inc: {
                        saleCount: -1,
                        totalAmount: -sale.total,
                    },
                }
            ),
        ]);

        return NextResponse.json({ message: "Sale deleted successfully" });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "Error deleting sale" },
            { status: 500 }
        );
    }
}
