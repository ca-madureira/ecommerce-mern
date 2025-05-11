import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import { ProductType } from "../types";

interface CartModalProps {
    visible: boolean;
    onClose: () => void;
    productId: string;
}

export const CartModal = ({ visible, onClose, productId }: CartModalProps) => {
    const [product, setProduct] = useState<ProductType | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (visible && productId) {
            setLoading(true);
            axios.get(`http://localhost:4000/api/products/${productId}`)
                .then(response => setProduct(response.data))
                .finally(() => setLoading(false));
        }
    }, [visible, productId]);

    if (!visible) return null;

    return (
        <section className="fixed inset-0 bg-gradient-to-r from-emerald-100 to-teal-500 flex items-center justify-center z-50">
            <article className="bg-white rounded-lg p-6 max-w-md w-full">
                {loading ? (
                    <p>Carregando...</p>
                ) : (
                    <>
                        <h1 className="text-xl font-bold mb-4">Produto adicionado ao carrinho!</h1>
                        {product && (
                            <figure className="flex items-center gap-4 mb-6">
                                <img
                                    src={product.images[0]}
                                    alt={product.name}
                                    className="w-20 h-20 object-cover rounded"
                                />
                                <figcaption>
                                    <h3 className="font-medium">{product.name}</h3>
                                    <p className="text-teal-700">
                                        R$ {product.price.toFixed(2).replace(".", ",")}
                                    </p>
                                </figcaption>
                            </figure>
                        )}
                        <div className="flex gap-3">
                            <Link to="/"
                                onClick={onClose}
                                className="flex-1 py-2 text-center border border-gray-300 rounded hover:bg-gray-50"
                            >
                                Continuar Comprando
                            </Link>
                            <Link
                                to="/cart"
                                onClick={() => {
                                    onClose();

                                }}
                                className="flex-1 py-2 text-center bg-teal-600 text-white font-medium rounded hover:bg-teal-700"
                            >
                                Ver Carrinho
                            </Link>
                        </div>
                    </>
                )}
            </article>
        </section>
    );
};