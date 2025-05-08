import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv';
import { connectDB } from './config/mongodb';
import userRouter from './routes/user.route';
import cartRouter from './routes/cart.route'
import { categoryRouter } from './routes/category.route';
import { productRouter } from './routes/product.route';
import { v2 as cloudinary } from 'cloudinary';

dotenv.config()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const app = express()
const port = 4000

app.use(express.json())
app.use(cors())
connectDB()

app.use('/api/categories', categoryRouter);
app.use('/api/products', productRouter)
app.use("/api/user", userRouter)
app.use("/api/shop/cart", cartRouter)

app.listen(port, () => console.log(`Servidor rodando ${port}`))

export default app