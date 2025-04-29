import mongoose, { Model, Schema } from "mongoose";
import { IProduct } from "../types/product";

const ProductSchema: Schema<IProduct> = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
})

const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema)

export default Product