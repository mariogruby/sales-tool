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
        unique: true
    },
    phoneNumber: {
        type: String,
        required: false,
    },
    direction: {
        type: String,
        required: false,
    },
    cif: {
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
    securityCode: {
        type: String,
        required: false,
        match: /^[0-9]{6}$/,
    },
    securityCodeEnabled: {
        type: Boolean,
        default: false,
    },
    protectedRoutes: {
        type: [String],
        default: [],
    },
    restaurantSales: {
        type: [{ type: Schema.Types.ObjectId, ref: "TotalSales" }],
        default: [],
    },
    invoiceIvaEnabled: {
        type: Boolean,
        default: false,
    },
    invoiceIvaPercent: {
        type: Number,
        default: 21,
    },
    resetToken: {
        type: String,
        default: null
    },
    resetTokenExpiry: {
        type: Date,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Restaurant: Model<IRestaurant> = mongoose.models.Restaurant || mongoose.model<IRestaurant>("Restaurant", RestaurantSchema)

export default Restaurant;