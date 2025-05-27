import mongoose, { Model, Schema } from "mongoose";
import { ISale } from "@/types/sale";

const SaleSchema: Schema<ISale> = new mongoose.Schema({
    products: [
        {
            productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true },
        },
    ],
    status: {
        type: String,
        enum: ["pagado", "pendiente"],
        default: "pendiente",
    },
    paymentType: {
        type: String,
        enum: ["efectivo", "tarjeta", "dividido"],
        default: "tarjeta",
    },
    paymentDetails: {
        cashAmount: { type: Number, default: 0 },
        cardAmount: { type: Number, default: 0 },
    },
    total: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Sale: Model<ISale> = mongoose.models.Sale || mongoose.model<ISale>("Sale", SaleSchema);

export default Sale;