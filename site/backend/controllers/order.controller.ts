import { Request, Response } from "express";
import { Order } from "../models/order.model";


function generateOrderNumber(): string {
    const timestamp = Date.now();
    const random = Math.floor(1000 + Math.random() * 9000);
    return `ORD-${timestamp}-${random}`;
}


export const createOrder = async (req: Request, res: Response) => {
    try {
        const { items, shippingAddress, paymentMethod, total } = req.body;

        if (!req.user?.id) {
            res.status(401).json({ message: "Usuário não autenticado" });
        }

        const order = await Order.create({
            orderNumber: generateOrderNumber(), // Novo número do pedido
            userId: req.user?.id,
            items,
            shippingAddress,
            paymentMethod,
            total,
            createdAt: new Date(),
        });

        res.status(201).json({
            message: "Pedido criado com sucesso",
            orderId: order._id,
            orderNumber: order.orderNumber,
        });
    } catch (error) {
        console.error("Erro ao criar pedido:", error);
        res.status(500).json({ message: "Erro ao criar pedido" });
    }
};


export const getOrders = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ message: "Usuário não autenticado" });
        }

        const orders = await Order.find({ userId }).sort({ createdAt: -1 });

        res.status(200).json({ orders });
    } catch (error) {
        console.error("Erro ao listar pedidos:", error);
        res.status(500).json({ message: "Erro ao listar pedidos" });
    }
};

