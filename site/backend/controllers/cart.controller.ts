import { Request, Response } from 'express';
import { Cart } from '../models/cart.model';
import { getCart, addToCart, removeFromCart, adjustItemQuantity } from '../services/cart.service';
import mongoose from 'mongoose';

export const getCartController = async (req: Request, res: Response): Promise<void> => {
    try {
        const cart = await Cart.findOne({ userId: new mongoose.Types.ObjectId(req.user?.id) })
            .populate({
                path: "items.productId",
                select: "name images description price"
            });

        console.log(JSON.stringify(cart, null, 2));
        res.json(cart);
    } catch (err) {
        console.error("Erro ao popular:", err);
        res.status(500).json({ error: "Erro ao buscar carrinho" });
    }
}

export const addToCartController = async (req: Request, res: Response) => {
    try {

        if (!req.user?.id) {
            res.status(401).json({ error: 'Unauthorized' });
        }

        const { productId, quantity, size } = req.body;


        if (!productId || quantity <= 0) {
            res.status(400).json({ error: 'Produto inválido ou quantidade deve ser maior que 0' });
        }


        console.log("Produto:", productId);
        console.log("Tipo do produto:", typeof productId);


        const cart = await addToCart(req.user?.id, { productId, quantity, size });


        res.json({ cart });
    } catch (err) {

        const message = err instanceof Error ? err.message : 'Unknown error';
        console.error('Erro ao adicionar ao carrinho:', message);
        res.status(500).json({ error: message });
    }
};

export const removeFromCartController = async (req: Request, res: Response) => {
    try {
        if (!req.user?.id) {
            res.status(401).json({ error: 'Unauthorized' });
        }

        const { itemId } = req.params

        const cart = await removeFromCart(req.user?.id, itemId);
        res.json({
            message: 'Item removido com sucesso',
            cart
        });
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        res.status(500).json({ error: message });
    }
};

export const updateQuantityController = async (req: Request, res: Response) => {
    try {
        const { itemId } = req.params
        const { operation } = req.body;

        const cart = await Cart.findOne({ userId: req.user?.id });
        console.log("Carrinho encontrado:", !!cart);

        if (!cart) {
            res.status(404).json({ message: "Carrinho não encontrado" });
            return;
        }


        const itemIndex = cart.items.findIndex(
            (item) => item?._id?.toString() === itemId
        );

        console.log("Item index:", itemIndex);

        if (itemIndex === -1) {
            res.status(404).json({ message: "Item não encontrado" });
            return;
        }
        if (operation === 'increment') {
            cart.items[itemIndex].quantity += 1;
            const updatedCart = await cart.save();
            console.log("Carrinho incrementado com sucesso");
            res.json(updatedCart);
        } else if (operation === 'decrement') {
            if (cart.items[itemIndex].quantity > 1) {
                cart.items[itemIndex].quantity -= 1;

                const updatedCart = await cart.save();
                console.log("Carrinho atualizado com sucesso");
                res.json(updatedCart);
            }
        }

    } catch (error) {
        console.error("Erro:", error);
        res.status(500).json({ message: "Erro interno do servidor" });
    }
};

export const incrementController = async (req: Request, res: Response) => {
    try {
        const { productId, size } = req.body;

        if (!productId || !size) {
            console.log("Parâmetros inválidos");
            res.status(400).json({ message: "Todos os campos são obrigatórios" });
            return;
        }

        const cart = await Cart.findOne({ userId: req.user?.id });


        if (!cart) {
            res.status(404).json({ message: "Carrinho não encontrado" });
            return;
        }


        const itemIndex = cart.items.findIndex(
            (item) => item.productId.toString() === productId.toString() && item.size === size
        );


        if (itemIndex === -1) {
            res.status(404).json({ message: "Item não encontrado" });
            return;
        }

        cart.items[itemIndex].quantity -= 1;
        const updatedCart = await cart.save();
        res.json(updatedCart);


    } catch (error) {
        console.error("Erro:", error);
        res.status(500).json({ message: "Erro interno do servidor" });
    }
};