import mongoose, { Model, Schema } from "mongoose"
import { IDailySales } from "@/types/daily-sales"

const DailySalesSchema: Schema<IDailySales> = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
        default: Date.now
    }, // Fecha del día
    sales: [{ type: Schema.Types.ObjectId, ref: 'Sale' }], // Lista de ventas del día
    totalAmount: {
        type: Number,
        default: 0
    }, // Suma de los totales de las ventas
    saleCount: {
        type: Number,
        default: 0
    } // Número de ventas realizadas
})

const DailySales: Model<IDailySales> = mongoose.models.DailySales || mongoose.model<IDailySales>("DailySales", DailySalesSchema)

export default DailySales