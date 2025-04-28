import mongoose, { Document, Model } from 'mongoose'

interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    cart: object
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
        type: Object,
        default: {}
    }
}, {
    minimize: false,
    timestamps: true
})

export const User: Model<IUser> = mongoose.model<IUser>("User", userSchema)