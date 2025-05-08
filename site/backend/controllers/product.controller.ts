import { Request, Response } from "express"
import { createProduct, deleteProductById, getAllProducts, getProductById } from "../services/product.service"
import { Product } from "../models/product.model";
import mongoose from 'mongoose';


export const createProductHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const filesObj = req.files as { [fieldname: string]: Express.Multer.File[] };

        const images: Express.Multer.File[] = [];

        // Pega os arquivos individualmente
        ['image1', 'image2', 'image3', 'image4'].forEach((field) => {
            if (filesObj[field] && filesObj[field][0]) {
                images.push(filesObj[field][0]);
            }
        });

        if (images.length === 0) {
            res.status(400).json({ error: "Pelo menos uma imagem é obrigatória" });
        }

        const { name, description, price, category, subCategory } = req.body;

        let sizes: string[] = [];

        if (req.body.sizes) {
            try {
                sizes = JSON.parse(req.body.sizes);
            } catch (err) {
                console.error("Erro ao fazer parse dos tamanhos:", err);
                sizes = [];
            }
        }


        const stock = req.body.stock || '0';

        const productCreated = await createProduct({
            name,
            description,
            price: Number(price),
            category,
            subCategory,
            sizes,
            stock: Number(stock),
            images,
        });

        res.status(201).json(productCreated);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao criar produto" });
    }
};

export const getAllProductsHandler = async (req: Request, res: Response) => {
    try {
        const products = await getAllProducts()
        res.status(200).json(products)
    } catch (err) {
        res.status(500).json({ error: "Erro ao buscar produtos" })
    }
}

export const deleteProductByIdHandler = async (req: Request, res: Response) => {
    try {
        const { id } = req.params

        const productDeleted = await deleteProductById(id)

        if (!productDeleted) {
            res.status(404).json({ message: "Produto não encontrado" })
        }

        res.status(200).json({ message: "Produto excluido com sucesso" })

    } catch (err) {
        res.status(500).json({ error: "Erro ao excluir produto" })
    }
}

export const getProductByIdHandler = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const product = await getProductById(id)
        res.status(200).json(product)
    } catch (err) {
        res.status(500).json({ error: "Erro ao buscar produtos" })
    }
}

export const loadProducts = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const products = await Product.find().skip(skip).limit(limit);
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar produtos" });
    }
}