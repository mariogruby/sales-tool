import mongoose, { Model, Schema } from "mongoose"
import { ITotalSales } from "@/types/total-sales"

const TotalSalesSchema: Schema<ITotalSales> = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    }, // Día cerrado
    totalAmount: {
        type: Number,
        required: true
    }, // Total vendido en el día
    saleCount: {
        type: Number,
        required: true
    }, // Total de ventas en el día
    sales: [{ type: Schema.Types.ObjectId, ref: 'Sale' }],
    restaurant: {
        type: Schema.Types.ObjectId,
        ref: "Restaurant",
        required: true
    },
    closedAt: {
        type: Date,
        default: Date.now
    }

})

const TotalSales: Model<ITotalSales> = mongoose.models.TotalSales || mongoose.model<ITotalSales>("TotalSales", TotalSalesSchema)

export default TotalSales