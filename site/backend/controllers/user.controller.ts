import { User } from "../models/user.model"
import { Request, Response } from "express"
import validator from 'validator'
import jwt from "jsonwebtoken"
import bcrypt from 'bcrypt'
import { Types } from "mongoose"

export const createToken = (id: Types.ObjectId) => {
    return jwt.sign({ id }, process.env.JWT_SECRET as string)
}

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            res.json({ success: false, message: "Usuário não existe" });
        }

        const isMatch = await bcrypt.compare(password, user?.password as string);

        if (isMatch) {
            const token = createToken(user?._id as Types.ObjectId);
            res.json({ success: true, token, user });
        } else {
            res.json({ success: false, message: "Credenciais inválidas" });
        }

    } catch (error) {
        if (error instanceof Error) {
            res.json({ success: false, message: error.message });
        } else {
            res.json({ success: false, message: "Erro desconhecido" });
        }
    }
}

export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body

        const exists = await User.findOne({ email })

        if (exists) {
            res.json({ success: false, message: "Usuario já existe" })
        }

        if (!validator.isEmail(email)) {
            res.json({ success: false, message: "Por favor insira email" })

        }

        if (password.length < 8) {
            res.json({ success: false, message: "Por favor insira uma senha forte" })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            name,
            email,
            password: hashedPassword
        })

        const user = await newUser.save()

        const token = createToken(user._id as Types.ObjectId)

        res.json({ success: true, token })

    } catch (error) {
        console.log(error)
        // res.json({ success: false, message: error.message })
    }
}