import mongoose, { Model, Schema } from "mongoose"
import { IOffer } from '../types/offer';

const OfferSchema: Schema<IOffer> = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    products: {
        type: [{ type: Schema.Types.ObjectId, ref: "Product" }],
        default: []
    },
    restaurant: {
        type: Schema.Types.ObjectId,
        ref: "Restaurant",
        required: true
    },
},
{ strict: true });

const Offer: Model<IOffer> = mongoose.models.Offer || mongoose.model<IOffer>("Offer", OfferSchema)

export default Offer