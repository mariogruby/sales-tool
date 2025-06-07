import { Document, Types } from "mongoose";

export interface ITableProduct {
    productId: Types.ObjectId;
    quantity: number;
    price: number;
  }

export interface ITable extends Document {
    _id: Types.ObjectId | string;
    number: number;
    location: "terraza" | "interior";
    products: ITableProduct[]
    isOccupied: boolean;
    restaurant: Types.ObjectId;
}