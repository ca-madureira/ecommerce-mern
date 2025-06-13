import { Schema, model, Document, Types } from "mongoose";

interface OrderItem {
    product: Types.ObjectId;
    quantity: number;
    size?: string;
}

export interface IOrder extends Document {
    orderNumber: string;
    userId: Types.ObjectId;
    items: OrderItem[];
    shippingAddress: {
        street: string;
        number: string;
        city: string;
        state: string;
        zipCode: string;
    };
    paymentMethod: string;
    total: number;
    createdAt: Date;
}

const orderItemSchema = new Schema<OrderItem>(
    {
        product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true },
        size: { type: String }
    },
    { _id: false }
);

const orderSchema = new Schema<IOrder>(
    {
        orderNumber: { type: String, required: true, unique: true },
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        items: { type: [orderItemSchema], required: true },
        shippingAddress: {
            street: { type: String, required: true },
            number: { type: String, required: true },
            city: { type: String, required: true },
            state: { type: String, required: true },
            zipCode: { type: String, required: true }
        },
        paymentMethod: { type: String },
        total: { type: Number, required: true }
    },
    { timestamps: true }
);

export const Order = model<IOrder>("Order", orderSchema);
