import express from 'express';
import dotenv from 'dotenv'
import cors from 'cors'
import { v2 as cloudinary } from 'cloudinary';

import { categoryRouter } from './routes/category.route';
import { connectMongo } from './db';
import { productRouter } from './routes/product.route';

dotenv.config()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: [
        "http://localhost:5173",
    ],
    credentials: true,
}))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/categories', categoryRouter);
app.use('/api/products', productRouter)

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    connectMongo()
});

export default app;