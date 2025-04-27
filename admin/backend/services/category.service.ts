import { Category } from '../models/category.model';

interface CreateCategoryInput {
    name: string;
    subcategories?: string[];
}

export const createCategory = async (input: CreateCategoryInput) => {
    const category = new Category({
        name: input.name,
        subcategories: input.subcategories || []
    });
    return await category.save();
};

export const getAllCategories = async () => {
    return await Category.find({});
}

export const deleteCategoryById = async (id: string) => {
    return await Category.findByIdAndDelete(id)
}