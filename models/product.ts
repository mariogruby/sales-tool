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
    category: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    restaurant: {
        type: Schema.Types.ObjectId,
        ref: "Restaurant",
        required: true
    },
}, 
{ strict: true });

const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
