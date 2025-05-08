import { useEffect, useState } from "react";
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

export const CartPage = () => {
    const cart = useAppSelector(selectCart);
    const status = useAppSelector(selectCartStatus);
    const error = useAppSelector(selectCartError);
    const updatingItemId = useAppSelector(selectUpdatingItemId);
    const itemErrors = useAppSelector(selectItemErrors);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchCart());
        }
    }, [dispatch, status]);

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

    const subtotal = cart.reduce((total, item) => {
        if (!item.product || typeof item.product.price !== 'number') {
            return total;
        }
        return total + item.product.price * item.quantity;
    }, 0);

    const shipping = subtotal > 500 ? 0 : 30;
    const total = subtotal + shipping;

    const handleQuantityChange = async (idItem: string, operation: 'increment' | 'decrement') => {

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

    const handleCheckout = () => {
        alert("Função de finalizar compra será implementada em breve!");
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-extrabold text-teal-700 mb-6">Seu Carrinho</h1>

                {error && (
                    <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
                        {error}
                    </div>
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
                                        className={`p-6 flex flex-col md:flex-row md:items-center gap-4 ${index < cart.length - 1 ? "border-b border-gray-200" : ""}`}
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
                                                <p className="text-xs text-red-500 mt-1">
                                                    {itemErrors[item.idItem]}
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex items-center">
                                            <button
                                                className={`w-8 h-8 rounded-full bg-teal-100 text-teal-700 hover:bg-teal-200 ${updatingItemId === item.idItem ? 'opacity-70 cursor-not-allowed' : ''
                                                    }`}
                                                onClick={() => handleQuantityChange(item.idItem, 'decrement')}
                                                disabled={updatingItemId === item.idItem || item.quantity <= 1}
                                            >
                                                -
                                            </button>
                                            <span className="mx-3 font-medium">
                                                {item.quantity}
                                            </span>
                                            <button
                                                className={`w-8 h-8 rounded-full bg-teal-100 text-teal-700 hover:bg-teal-200 ${updatingItemId === item.idItem ? 'opacity-70 cursor-not-allowed' : ''
                                                    }`}
                                                onClick={() => handleQuantityChange(item.idItem, 'increment')}
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
                                                className={`text-sm text-red-500 hover:text-red-700 ${updatingItemId === item.idItem ? 'opacity-70 cursor-not-allowed' : ''
                                                    }`}
                                                onClick={() => handleRemoveItem(item.idItem)}
                                                disabled={updatingItemId === item.idItem}
                                            >
                                                {/* {updatingItemId === item.idItem ? 'Removendo...' : 'Remover'} */}
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
                                    <span className="font-medium">{formatPrice(subtotal)}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-600">Frete</span>
                                    <span className="font-medium">
                                        {shipping === 0 ? "Grátis" : formatPrice(shipping)}
                                    </span>
                                </div>

                                <div className="pt-4 border-t border-gray-200">
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-semibold text-gray-800">Total</span>
                                        <span className="text-xl font-bold text-teal-700">
                                            {formatPrice(total)}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleCheckout}
                                    className={`w-full mt-6 px-6 py-3 bg-teal-600 text-white font-medium rounded-md hover:bg-teal-700 ${status === 'loading' ? 'opacity-70 cursor-not-allowed' : ''
                                        }`}
                                    disabled={status === 'loading'}
                                >
                                    Finalizar Compra
                                </button>

                                <Link
                                    to="/"
                                    className="block w-full text-center mt-3 px-6 py-3 bg-white text-teal-600 font-medium rounded-md border border-teal-600 hover:bg-teal-50"
                                >
                                    Continuar Comprando
                                </Link>
                            </div>
                        </div>

                        <div className="mt-6 bg-teal-50 p-4 rounded-lg border border-teal-100">
                            <div className="flex items-start gap-3">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 text-teal-500 flex-shrink-0 mt-0.5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                <div>
                                    <p className="text-sm text-teal-800 font-medium mb-1">Informações importantes:</p>
                                    <ul className="text-xs text-teal-700 space-y-1 list-disc list-inside">
                                        <li>Frete grátis para compras acima de R$ 500,00</li>
                                        <li>Entrega em 3-5 dias úteis</li>
                                        <li>Pagamento seguro com todas as bandeiras de cartão</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};