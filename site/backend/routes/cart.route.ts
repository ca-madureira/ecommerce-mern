import express from 'express'
import {
    getCartController,
    addToCartController,
    removeFromCartController,
    updateQuantityController

} from '../controllers/cart.controller'

import { requireAuth } from '../middleware/auth.middleware'

const cartRouter = express.Router()

// Todas as rotas abaixo exigem autenticação
cartRouter.use(requireAuth)

cartRouter.post("/add", addToCartController)
cartRouter.get("/", getCartController)
cartRouter.put("/:itemId", updateQuantityController);
cartRouter.delete('/:itemId', removeFromCartController)




export default cartRouter
