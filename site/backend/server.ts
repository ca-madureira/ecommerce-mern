import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv';
import { connectDB } from './config/mongodb';
import userRouter from './routes/user.route';

dotenv.config()

const app = express()
const port = process.env.PORT || 4000

app.use(express.json())
app.use(cors())
connectDB()

app.use("/api/user", userRouter)

app.listen(port, () => console.log(`Servidor rodando ${port}`))

export default app