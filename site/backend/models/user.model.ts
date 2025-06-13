import mongoose, { Document, Model, Types } from 'mongoose'


export interface CartItem {
    productId: string;
    quantity: number;
    size?: string;
}

export interface IUser extends Document {
    _id: Types.ObjectId
    name: string
    email: string
    password: string
    cart: CartItem[]
}

export const userSchema = new mongoose.Schema<IUser>({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    cart: {
        type: [Object],
        default: []
    }
}, {
    minimize: false,
    timestamps: true
})

export const User: Model<IUser> = mongoose.model<IUser>("User", userSchema)