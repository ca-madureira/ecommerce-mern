import express from 'express'
import upload from '../middleware/multer'
import { createProductHandler, getAllProductsHandler, deleteProductByIdHandler, getProductByIdHandler, loadProducts } from '../controllers/product.controller'

export const productRouter = express.Router()

productRouter.post("/create", upload.fields([{ name: "image1", maxCount: 1 }, { name: "image2", maxCount: 1 }, { name: "image3", maxCount: 1 }, { name: "image4", maxCount: 1 }]), createProductHandler)
productRouter.get("/:id", getProductByIdHandler);
productRouter.get("/", getAllProductsHandler)
productRouter.delete("/:id", deleteProductByIdHandler)
productRouter.get("/products", loadProducts);
