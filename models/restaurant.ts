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
    phoneNumber: {
        type: String,
        required: false,
    },
    direction:{
        type: String,
        required: false,
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
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Restaurant: Model<IRestaurant> = mongoose.models.Restaurant || mongoose.model<IRestaurant>("Restaurant", RestaurantSchema)

export default Restaurant;