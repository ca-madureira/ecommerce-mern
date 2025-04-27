import mongoose, { Document, Model } from 'mongoose'

export interface ICategory extends Document {
    name: string;
    subcategories: string[];
}

const categorySchema = new mongoose.Schema<ICategory>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            unique: true
        },
        subcategories: {
            type: [String],
            default: []
        }
    },
    {
        timestamps: true
    }
)

export const Category: Model<ICategory> = mongoose.model<ICategory>("Category", categorySchema);