import mongoose, { Document, Model } from 'mongoose'
import { Category } from './category.model'

export interface IProduct extends Document {
    name: string;
    images: string[];
    description: string;
    price: number;
    category: string;
    subCategory: string;
    sizes: string[];
    stock: number;
}

const productSchema = new mongoose.Schema<IProduct>({
    name: {
        type: String,
        required: true,
        trim: true
    },
    images: [{ type: String }],
    description: {
        type: String,
        trim: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,

        required: true
    },
    subCategory: {
        type: String,
        required: true,

        validate: {
            validator: function (this: any, subCat: string): boolean {
                return true;
            },
            message: 'A subcategoria selecionada não pertence à categoria escolhida'
        }
    },
    sizes: {
        type: [String],
        default: []
    },
    stock: {
        type: Number,
    },

}, {
    timestamps: true
})


productSchema.pre('save', async function (next) {
    try {
        const category = await Category.findOne({ name: this.category });

        if (!category) {
            throw new Error('Categoria não encontrada');
        }

        if (!category.subcategories.includes(this.subCategory)) {
            throw new Error('A subcategoria selecionada não pertence à categoria escolhida');
        }

        next();
    } catch (error) {
        next(error as Error);
    }
});


export const Product: Model<IProduct> = mongoose.model<IProduct>("Product", productSchema);