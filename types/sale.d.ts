import { Document, Types } from "mongoose";

export interface ISaleProduct {
  productId: Types.ObjectId; // Referencia al producto
  quantity: number;
  price: number; // Precio en el momento de la venta
}

export interface ISale extends Document {
  _id: Types.ObjectId;
  products: ISaleProduct[];
  status: "pagado" | "pendiente";
  paymentType: "efectivo" | "tarjeta";
  total: number;
  createdAt: Date;
}
