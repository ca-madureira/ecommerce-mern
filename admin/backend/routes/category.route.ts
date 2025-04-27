import express from 'express'
import { createCategoryHandler, deleteCategoryByIdHandler, getAllCategoriesHandler } from '../controllers/category.controller'

export const categoryRouter = express.Router()

categoryRouter.post("/create", createCategoryHandler)
categoryRouter.get("/", getAllCategoriesHandler)
categoryRouter.delete("/:id", deleteCategoryByIdHandler)