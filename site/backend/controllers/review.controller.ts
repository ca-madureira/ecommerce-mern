import { Request, Response } from "express";
import {
  addReviewService,
  deleteReviewService,
  editReviewService,
  getReviewsProductService,
} from "../services/review.service";

export const addReview = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;


    console.log(req.body)
    console.log(typeof req.body.productId)
    console.log(userId)

    const review = await addReviewService(userId, req.body);
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao adicionar review' });
  }
};

export const editReview = async (req: Request, res: Response) => {
  try {
    const idReview = req.params.reviewId;
    const updatedReview = await editReviewService(idReview, req.body);

    res.status(200).json(updatedReview);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao editar review' });
  }
};

export const getReviewsProduct = async (req: Request, res: Response) => {
  try {
    const idProduct = req.params.productId;
    const reviews = await getReviewsProductService(idProduct);
    console.log('id', idProduct)
    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar reviews' });
  }
};

export const deleteReview = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const idReview = req.params.reviewId;
    console.log('usuario id', userId)
    console.log('idReview', idReview)

    await deleteReviewService(idReview, userId);

    // if (!deleted) {
    //   res.status(404).json({ message: 'Review não encontrado ou usuário não autorizado' });
    // }

    res.status(200).json({ message: 'Review deletado com sucesso' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao deletar review' });
  }
};
