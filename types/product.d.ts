import { Document } from "mongoose";
export interface IProduct extends Document {
  _id: Types.ObjectId | string;
  name: string;
  price: number;
  isAvailable?: boolean;
  category: Types.ObjectId;
  restaurant: Types.ObjectId;
}
