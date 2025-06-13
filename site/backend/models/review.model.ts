import mongoose, { Document, Model, Types } from "mongoose";

export interface IReview extends Document {
  productId: Types.ObjectId;
  userId: Types.ObjectId;
  rating: number;
  comment: string;
  date: string
}

export const reviewSchema = new mongoose.Schema<IReview>({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  rating: {
    type: Number,
    default: 0
  },
  comment: {
    type: String,
    required: true
  },

}, {
  timestamps: true
})

export const Review: Model<IReview> = mongoose.model<IReview>("Review", reviewSchema)