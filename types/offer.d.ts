import { Document, Types } from "mongoose";

export interface IOffer extends Document {
    _id: string;
    name: string;
    products: Types.ObjectId[];
    restaurant: Types.ObjectId;
}