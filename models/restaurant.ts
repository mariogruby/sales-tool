import mongoose, {Document, Model, Schema} from "mongoose";

interface IRestaurant extends Document{
    name: string;
    email: string;
    password?: string;
    id: string
}

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
})

const Restaurant: Model<IRestaurant> = mongoose.models.Restaurant || mongoose.model<IRestaurant>("Restaurant", RestaurantSchema)

export default Restaurant;