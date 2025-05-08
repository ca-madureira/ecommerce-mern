import { useEffect, useState } from "react";
import API from "../services/cartAPI";
import { ProductType } from "../types";
import axios from "axios";

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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
                {loading ? (
                    <p>Carregando...</p>
                ) : (
                    <>
                        <h2 className="text-xl font-bold mb-4">Produto adicionado ao carrinho!</h2>
                        {product && (
                            <div className="flex items-center gap-4 mb-6">
                                <img
                                    src={product.images[0]}
                                    alt={product.name}
                                    className="w-20 h-20 object-cover rounded"
                                />
                                <div>
                                    <h3 className="font-medium">{product.name}</h3>
                                    <p className="text-teal-600">
                                        R$ {product.price.toFixed(2).replace(".", ",")}
                                    </p>
                                </div>
                            </div>
                        )}
                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                className="flex-1 py-2 border border-gray-300 rounded hover:bg-gray-50"
                            >
                                Continuar Comprando
                            </button>
                            <button
                                onClick={() => {
                                    onClose();
                                    window.location.href = "/cart";
                                }}
                                className="flex-1 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
                            >
                                Ver Carrinho
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};