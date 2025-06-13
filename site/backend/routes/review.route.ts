import express from 'express'
import { addReview, editReview, getReviewsProduct, deleteReview } from '../controllers/review.controller'

import { requireAuth } from '../middleware/auth.middleware'

const reviewRouter = express.Router()

reviewRouter.use(requireAuth)

reviewRouter.post("/add", addReview)
reviewRouter.get("/:productId", getReviewsProduct)
reviewRouter.put("/:reviewId", editReview);
reviewRouter.delete('/:reviewId', deleteReview)




export default reviewRouter
