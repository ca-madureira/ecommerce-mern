import mongoose, { Document, Model, mongo, Types } from "mongoose";

export interface Item {
    productId: mongoose.Schema.Types.ObjectId | string;
    quantity: number;
    size: string;
    _id?: mongoose.Schema.Types.ObjectId;
}

export interface ICart {
    userId: mongoose.Schema.Types.ObjectId,
    items: Item[]

}

export const cartSchema = new mongoose.Schema<ICart>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 1
            },
            size: {
                type: String,
                default: ""
            }
        }
    ]
})

export const Cart: Model<ICart> = mongoose.model<ICart>("Cart", cartSchema)