import { Request, Response } from 'express';
import { createCategory, deleteCategoryById, getAllCategories as getAllCategoriesService } from '../services/category.service';

export const createCategoryHandler = async (req: Request, res: Response) => {
    try {
        const { category, subcategories } = req.body;
        const categoryCreated = await createCategory({ name: category, subcategories });
        res.status(201).json(categoryCreated);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao criar categoria' });
    }
};

export const getAllCategoriesHandler = async (req: Request, res: Response) => {
    try {
        const categories = await getAllCategoriesService();
        res.status(200).json(categories);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao buscar categorias' });
    }
};

export const deleteCategoryByIdHandler = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const categoryDeleted = await deleteCategoryById(id);

        if (!categoryDeleted) {
            res.status(404).json({ message: "Categoria não encontrada" });
        }

        res.status(200).json({ message: "Categoria excluída com sucesso", category: categoryDeleted });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao excluir categoria" });
    }
}