import mongoose, { Model, Schema } from "mongoose";
import { IRestaurant } from "../types/restaurant";

const RestaurantSchema: Schema<IRestaurant> = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique:true
    },
    password: {
        type: String,
        required: false,
    },
    products: {
        type: [{ type: Schema.Types.ObjectId, ref: "Product" }],
        default: [],
    },
    restaurantSales: {
        type: [{ type: Schema.Types.ObjectId, ref: "TotalSales"}],
        default: [],
    }
})

const Restaurant: Model<IRestaurant> = mongoose.models.Restaurant || mongoose.model<IRestaurant>("Restaurant", RestaurantSchema)

export default Restaurant;