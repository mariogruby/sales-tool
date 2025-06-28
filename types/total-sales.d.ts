import { Document, Types } from "mongoose";

export interface ITotalSales extends Document {
    _id: string;
    date: Date;
    totalAmount: number;
    saleCount: number;
    sales: Types.ObjectId[];
    restaurant: Types.ObjectId;
    closedAt: Date;
}