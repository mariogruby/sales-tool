import { Document, Types } from "mongoose";

export interface ICategory extends Document {
    _id: string;
    name: string;
    products: Types.ObjectId[];
    restaurant: Types.ObjectId;
}
