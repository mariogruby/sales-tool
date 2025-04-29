import { Document } from "mongoose";

export interface IRestaurant extends Document{
    name: string;
    email: string;
    password?: string;
    id: string
}