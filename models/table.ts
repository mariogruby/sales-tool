import mongoose, {Model, Schema } from "mongoose"
import { ITable } from "@/types/table"

const TableSchema: Schema<ITable> = new mongoose.Schema({
    number: {
        type: Number,
        required: true,
        unique: true,
    },
    location: {
        type: String,
        enum:['terraza', 'interior'],
        required: true
    },
    products: {
        type: [{ type: Schema.Types.ObjectId, ref: "Product" }],
        default: []
    },
    isOccupied: { 
        type: Boolean, 
        default: false 
    },
    restaurant: {
        type: Schema.Types.ObjectId,
        ref: "Restaurant",
        required: true
    },

})

const Table: Model<ITable> = mongoose.models.Table || mongoose.model<ITable>("Table", TableSchema)

export default Table