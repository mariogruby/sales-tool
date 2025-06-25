import { Document } from "mongoose";

export interface IRestaurant extends Document{
    name: string;
    email: string;
    phoneNumber: string;
    direction: string;
    password?: string;
    id: string;
    products: Types.ObjectId[];
    restaurantSales: Types.ObjectId[];
    createdAt: Date;
}