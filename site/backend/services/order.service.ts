import { Order } from "../models/order.model";

interface OrderInput {
    userId: string;
    fullName: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    amount: number;
}

export const createOrder = async (data: OrderInput) => {
    try {
        const order = await Order.create({
            ...data,
            paymentIntentId: "",
        });

        return {
            orderId: order._id,
        };
    } catch (error) {
        console.error("Erro ao salvar pedido:", error);
        throw new Error("Erro ao salvar pedido");
    }
};

export const getOrdersByUserId = async (userId: string) => {
    return await Order.find({ userId }).sort({ createdAt: -1 });
};
