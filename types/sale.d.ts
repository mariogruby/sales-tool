import { Document, Types } from "mongoose";

export interface ISaleProduct {
  productId: Types.ObjectId;
  quantity: number;
  price: number;
}

export interface ISale extends Document {
  _id: Types.ObjectId;
  products: ISaleProduct[];
  status: "pagado" | "pendiente";
  paymentType: "efectivo" | "tarjeta" | "dividido";
  paymentDetails?: {
    cashAmount: number;
    cardAmount: number;
  };
  total: number;
  restaurant: Types.ObjectId;
  createdAt: Date;
}