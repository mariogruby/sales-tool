import { Document, Types } from "mongoose";

export interface IDailySales extends Document {
    _id: string;
    date: Date;
    sales: Types.ObjectId[];
    totalAmount: number;
    saleCount: number;
    isClosed?: boolean;
    restaurant: Types.ObjectId;
}