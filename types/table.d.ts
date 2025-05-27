import { Document, Types } from "mongoose";

export interface ITable extends Document {
    _id: Types.ObjectId | string;
    number: number;
    location: "terraza" | "interior";
    products: Types.ObjectId[]
    isOccupied: boolean;
    restaurant: Types.ObjectId;
}