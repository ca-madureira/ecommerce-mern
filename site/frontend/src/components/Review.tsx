import { useEffect, useState } from "react";
import { CiStar } from "react-icons/ci";
import { FaStar } from "react-icons/fa";
import { FiEdit, FiTrash2 } from "react-icons/fi"
import { useParams } from "react-router-dom";
import axios from "axios";

import { useSelector } from "react-redux";
import { RootState } from "../store";

interface IReview {
  _id: string;
  productId: string;
  userId: {
    _id: string;
    name: string;
  };
  rating: number;
  comment: string;
}

export const Review = () => {
  const { productId } = useParams();
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [selectedStar, setSelectedStar] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [listReviews, setListReviews] = useState<IReview[]>([]);
  const [editReviewId, setEditReviewId] = useState<string | null>(null);

  const token = localStorage.getItem("token") || "";
  const user = useSelector((state: RootState) => state.auth.user);
  console.log(user?._id)

  const handleMouseEnter = (index: number) => setHoveredStar(index);
  const handleMouseLeave = () => setHoveredStar(null);
  const handleClick = (index: number) => setSelectedStar(index);

  const renderStars = () =>
    Array.from({ length: 5 }, (_, index) => {
      const filled = (hoveredStar ?? selectedStar ?? 0) > index;
      return (
        <span
          key={index}
          className="cursor-pointer text-2xl text-teal-600 transition"
          onMouseEnter={() => handleMouseEnter(index + 1)}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleClick(index + 1)}
        >
          {filled ? <FaStar /> : <CiStar />}
        </span>
      );
    });

  const getReviews = () => {
    axios
      .get(`http://localhost:4000/api/reviews/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setListReviews(res.data))
      .catch((err) => console.log(err));
  };

  const createReview = () => {
    if (!comment || !selectedStar || !productId) {
      alert("Preencha todos os campos.");
      return;
    }

    axios
      .post(
        "http://localhost:4000/api/reviews/add",
        { comment, rating: selectedStar, productId },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        setComment("");
        setSelectedStar(null);
        getReviews();
      })
      .catch((err) => console.error("Erro ao postar review:", err));
  };

  const updateReview = () => {
    if (!editReviewId || !comment || !selectedStar) return;

    axios
      .put(
        `http://localhost:4000/api/reviews/${editReviewId}`,
        { comment, rating: selectedStar },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        setComment("");
        setSelectedStar(null);
        setEditReviewId(null);
        getReviews();
      })
      .catch((err) => console.error("Erro ao editar review:", err));
  };

  const deleteReview = (reviewId: string) => {

    axios
      .delete(`http://localhost:4000/api/reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => getReviews())
      .catch((err) => console.error("Erro ao excluir review:", err));
  };

  const handleEdit = (review: IReview) => {
    setEditReviewId(review._id);
    setComment(review.comment);
    setSelectedStar(review.rating);
  };

  useEffect(() => {
    if (productId) getReviews();
  }, [productId]);

  return (
    <section className="min-h-[60vh] border-t border-zinc-300 px-6 py-12 mx-auto flex flex-col gap-10 max-w-3xl">
      <h2 className="text-2xl text-teal-600 font-bold text-center">Avaliações</h2>

      <article className="w-full">
        <span className="text-base text-zinc-700 font-semibold">
          {editReviewId ? "Edite sua avaliação:" : "Deixe sua avaliação:"}
        </span>

        <div className="flex flex-col gap-4 mt-2">
          <div className="flex">{renderStars()}</div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Escreva seu comentário..."
            className="w-full h-[18vh] border border-gray-400 rounded-md p-2 resize-none outline-none"
          />
          <div className="flex gap-4 justify-end">
            {editReviewId ? (
              <>
                <button
                  onClick={() => {
                    setEditReviewId(null);
                    setComment("");
                    setSelectedStar(null);
                  }}
                  className="px-4 py-2 bg-gray-400 font-medium text-white rounded-md transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  onClick={updateReview}
                  className="px-6 py-2 bg-teal-600 hover:bg-teal-700 font-medium text-white rounded-md transition cursor-pointer"
                >
                  Salvar
                </button>
              </>
            ) : (
              <button
                onClick={createReview}
                className="self-end bg-teal-600 hover:bg-teal-700 px-6 py-2 text-white font-medium rounded-md transition cursor-pointer"
              >
                Postar
              </button>
            )}
          </div>
        </div>
      </article>

      <div className="flex flex-col gap-6 mt-8">
        {listReviews.map((item) => (
          <div key={item._id} className="border border-zinc-200 rounded-md p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-zinc-800 font-semibold">
                {item.userId.name || "Usuário"}
              </span>
              <div className="flex text-teal-500 text-xl">
                {Array.from({ length: 5 }, (_, idx) =>
                  idx < item.rating ? <FaStar key={idx} /> : <CiStar key={idx} />
                )}
              </div>
            </div>
            <p className="text-sm text-zinc-600 mb-2">{item.comment}</p>
            {user?._id === item.userId._id && (
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => handleEdit(item)}
                  className="text-orange-600 text-sm hover:underline cursor-pointer"
                >
                  <FiEdit />
                </button>
                <button
                  onClick={() => deleteReview(item._id)}
                  className="text-red-600 text-sm hover:underline cursor-pointer"
                >
                  <FiTrash2 />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
