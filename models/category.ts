import mongoose, { Model, Schema } from "mongoose";
import { ICategory } from "@/types/category";


const CategorySchema: Schema<ICategory> = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    color: {
        type: String,
        default: "bg-slate-100 text-slate-800" // color por defecto
    },
    products: {
        type: [{ type: Schema.Types.ObjectId, ref: "Product" }],
        default: []
    },
    restaurant: {
        type: Schema.Types.ObjectId,
        ref: "Restaurant",
        required: true
    }
});

const Category: Model<ICategory> = mongoose.models.Category || mongoose.model<ICategory>("Category", CategorySchema);

export default Category;

