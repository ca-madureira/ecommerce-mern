import mongoose, { Document, Model, Types } from 'mongoose'

// Interface para um item do carrinho
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
    cart: CartItem[]  // Array de itens do carrinho
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
        type: [Object],  // Array de objetos
        default: []      // Valor padrão como array vazio
    }
}, {
    minimize: false,
    timestamps: true
})

export const User: Model<IUser> = mongoose.model<IUser>("User", userSchema)