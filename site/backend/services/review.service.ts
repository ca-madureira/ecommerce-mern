import { Review } from "../models/review.model";
import { Types } from "mongoose";

export const addReviewService = (userId: string, data: any) => {
  return Review.create({ ...data, userId });
};

export const getReviewsProductService = (idProduct: string) => {
  const objectId = new Types.ObjectId(idProduct);
  return Review.find({ productId: objectId }).populate({ path: 'userId', select: 'name' }).sort({ createdAt: -1 });
};

export const editReviewService = (idReview: string, data: any) => {
  return Review.findByIdAndUpdate(idReview, data, { new: true });
};

export const deleteReviewService = (idReview: string, userId: string) => {
  const objectId = new Types.ObjectId(idReview);
  return Review.findOneAndDelete({ _id: objectId, userId });
};
