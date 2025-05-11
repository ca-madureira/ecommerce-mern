import { IProduct, Product } from "../models/product.model"
import { v2 as cloudinary } from 'cloudinary'
import { Types } from "mongoose";

interface ICreateProductInput {
    name: string;
    description: string;
    price: number;
    category: string;
    subCategory: string;
    sizes: string[];
    stock: number;
    images: Express.Multer.File[];
}

export const createProduct = async (productInput: ICreateProductInput) => {
    const { images, ...productData } = productInput;


    const uploadedImages: string[] = [];

    for (const image of images) {
        const result = await cloudinary.uploader.upload(image.path, {
            resource_type: "image",
            folder: "products"
        });
        uploadedImages.push(result.secure_url);
    }


    const newProduct = new Product({
        ...productData,
        images: uploadedImages
    });

    return await newProduct.save();
};
export const getProductById = async (id: string) => {
    return await Product.findById(id)
}

export const getAllProducts = async () => {
    return await Product.find({})
}

export const deleteProductById = async (id: string) => {
    return await Product.findByIdAndDelete(id)
}