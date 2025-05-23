import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { formatPrice } from "../util";
import {
    fetchCart,
    removeItemFromCart,
    updateItemQuantity,
    updateQuantityOptimistic,
    selectCart,
    selectCartStatus,
    selectCartError,
    selectUpdatingItemId,
    selectItemErrors,
} from "../store/slices/cartSlice";
import { Link } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";

export const Cart = () => {
    const cart = useAppSelector(selectCart);
    const status = useAppSelector(selectCartStatus);
    const error = useAppSelector(selectCartError);
    const updatingItemId = useAppSelector(selectUpdatingItemId);
    const itemErrors = useAppSelector(selectItemErrors);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (status === "idle") {
            dispatch(fetchCart());
        }
    }, [dispatch, status]);

    const stripePromise = loadStripe("your-stripe-publishable-key");

    const handleQuantityChange = async (idItem: string, operation: "increment" | "decrement") => {
        dispatch(updateQuantityOptimistic({ idItem, operation }));
        try {
            await dispatch(updateItemQuantity({ idItem, operation })).unwrap();
        } catch (error) {
            console.error("Erro ao atualizar quantidade:", error);
        }
    };

    const handleRemoveItem = async (id: string) => {
        try {
            await dispatch(removeItemFromCart(id)).unwrap();
        } catch (error) {
            console.error("Erro ao remover item:", error);
        }
    };

    const handleCheckout = async () => {
        const stripe = await stripePromise;
        if (!stripe) {
            console.error("Erro ao carregar o Stripe.");
            return;
        }


        const response = await fetch("/api/create-checkout-session", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                cart,
            }),
        });

        const session = await response.json();


        const result = await stripe.redirectToCheckout({
            sessionId: session.id,
        });

        if (result.error) {
            console.error("Erro ao redirecionar para o Stripe Checkout:", result.error.message);
        }
    };

    const subtotal = cart.reduce((total, item) => {
        if (!item.product || typeof item.product.price !== "number") {
            return total;
        }
        return total + item.product.price * item.quantity;
    }, 0);

    const shipping = subtotal > 500 ? 0 : 30;
    const total = subtotal + shipping;

    if (status === "loading" && cart.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-gray-600 text-lg">Carregando carrinho...</p>
            </div>
        );
    }

    if (cart.length === 0 && status === "succeeded") {
        return (
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-3xl font-extrabold text-teal-700 mb-6">Seu Carrinho</h1>
                        <div className="bg-white p-8 rounded-lg shadow-md">
                            <div className="flex flex-col items-center justify-center py-12">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-24 w-24 text-teal-400 mb-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                    />
                                </svg>
                                <h2 className="text-2xl font-semibold text-gray-800 mb-2">Seu carrinho está vazio</h2>
                                <p className="text-gray-600 mb-6">Explore nossa loja e adicione produtos incríveis ao seu carrinho</p>
                                <Link
                                    to="/"
                                    className="px-6 py-3 bg-teal-600 text-white font-medium rounded-md hover:bg-teal-700 transition-colors"
                                >
                                    Voltar para a loja
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-extrabold text-teal-700 mb-6">Seu Carrinho</h1>

                {error && (
                    <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">{error}</div>
                )}

                <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                    <div className="lg:col-span-8">
                        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6 lg:mb-0">
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-xl font-semibold text-gray-800">Produtos ({cart.length})</h2>
                            </div>

                            <div>
                                {cart.map((item, index) => (
                                    <div
                                        key={`${item.product._id}-${item.size}`}
                                        className={`p-6 flex flex-col md:flex-row md:items-center gap-4 ${index < cart.length - 1 ? "border-b border-gray-200" : ""
                                            }`}
                                    >
                                        <div className="w-full md:w-24 h-24 flex-shrink-0">
                                            <img
                                                src={item.product?.images?.[0] || "/placeholder.jpg"}
                                                alt={item.product?.name || "Produto sem nome"}
                                                className="w-full h-full object-cover rounded-md"
                                            />
                                        </div>

                                        <div className="flex-grow">
                                            <h3 className="text-lg font-medium text-gray-800">
                                                {item.product?.name ?? "Produto indisponível"}
                                            </h3>
                                            <p className="text-sm text-gray-600 mb-1">Tamanho: {item.size}</p>
                                            <p className="text-base font-semibold text-teal-600">
                                                {formatPrice(item.product?.price)}
                                            </p>
                                            {itemErrors[item.idItem] && (
                                                <p className="text-xs text-red-500 mt-1">{itemErrors[item.idItem]}</p>
                                            )}
                                        </div>

                                        <div className="flex items-center">
                                            <button
                                                className={`w-8 h-8 rounded-full bg-teal-100 text-teal-700 hover:bg-teal-200 ${updatingItemId === item.idItem
                                                    ? "opacity-70 cursor-not-allowed"
                                                    : ""
                                                    }`}
                                                onClick={() => handleQuantityChange(item.idItem, "decrement")}
                                                disabled={updatingItemId === item.idItem || item.quantity <= 1}
                                            >
                                                -
                                            </button>
                                            <span className="mx-3 font-medium">{item.quantity}</span>
                                            <button
                                                className={`w-8 h-8 rounded-full bg-teal-100 text-teal-700 hover:bg-teal-200 ${updatingItemId === item.idItem
                                                    ? "opacity-70 cursor-not-allowed"
                                                    : ""
                                                    }`}
                                                onClick={() => handleQuantityChange(item.idItem, "increment")}
                                                disabled={updatingItemId === item.idItem}
                                            >
                                                +
                                            </button>
                                        </div>

                                        <div className="flex flex-col items-end">
                                            <span className="font-semibold text-gray-800 mb-1">
                                                {formatPrice(item.product?.price * item.quantity)}
                                            </span>
                                            <button
                                                className={`text-sm text-red-500 hover:text-red-700 ${updatingItemId === item.idItem
                                                    ? "opacity-70 cursor-not-allowed"
                                                    : ""
                                                    }`}
                                                onClick={() => handleRemoveItem(item.idItem)}
                                                disabled={updatingItemId === item.idItem}
                                            >
                                                Remover
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-4 mt-6 lg:mt-0">
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-xl font-semibold text-gray-800">Resumo do Pedido</h2>
                            </div>

                            <div className="p-6 space-y-4">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-semibold text-gray-800">{formatPrice(subtotal)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Frete</span>
                                    <span className="font-semibold text-gray-800">{formatPrice(shipping)}</span>
                                </div>

                                <div className="flex justify-between font-semibold text-teal-600">
                                    <span>Total</span>
                                    <span>{formatPrice(total)}</span>
                                </div>

                                <Link to="/checkout"
                                    onClick={handleCheckout}
                                    className="w-full py-3 px-2 bg-teal-600 text-white font-medium rounded-md hover:bg-teal-700 mt-4"
                                >
                                    Finalizar Compra
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
