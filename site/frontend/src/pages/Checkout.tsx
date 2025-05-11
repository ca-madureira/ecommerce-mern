import React, { useState } from "react";
import axios from "axios";
import { useAppSelector } from "../store/hooks";
import { useNavigate } from "react-router-dom";

const api = axios.create({
    baseURL: "http://localhost:4000/api/payments/orders",
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

const CheckoutPage = () => {
    const [addressData, setAddressData] = useState({
        address: "",
        number: "",
        city: "",
        state: "",
        zipCode: "",
    });

    const cartItems = useAppSelector((state) => state.cart.cart);
    const navigate = useNavigate();

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAddressData({
            ...addressData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post("/create", {
                shippingAddress: {
                    street: addressData.address,
                    number: addressData.number,
                    city: addressData.city,
                    state: addressData.state,
                    zipCode: addressData.zipCode,
                },
                paymentMethod: "credit_card",
                total: calculateTotal(),
                items: cartItems.map(item => ({
                    product: item.product._id,
                    quantity: item.quantity,
                    size: item.size,
                })),
            });

            alert("Pedido salvo com sucesso!");
            navigate("/orders");
        } catch (err) {
            console.error("Erro ao salvar pedido:", err);
            alert("Erro ao salvar pedido.");
        }
    };

    return (
        <div className="min-h-screen bg-teal-50 flex items-center justify-center p-6">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl p-8">
                <h2 className="text-2xl font-bold mb-6">Endereço de Entrega</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        name="address"
                        type="text"
                        placeholder="Rua"
                        value={addressData.address}
                        onChange={handleChange}
                        className="w-full p-2 border border-teal-300 rounded"
                    />
                    <input
                        name="number"
                        type="number"
                        placeholder="Número"
                        value={addressData.number}
                        onChange={handleChange}
                        className="w-full p-2 border border-teal-300 rounded"
                        min="1"
                    />
                    <input
                        name="city"
                        type="text"
                        placeholder="Cidade"
                        value={addressData.city}
                        onChange={handleChange}
                        className="w-full p-2 border border-teal-300 rounded"
                    />
                    <input
                        name="state"
                        type="text"
                        placeholder="Estado"
                        value={addressData.state}
                        onChange={handleChange}
                        className="w-full p-2 border border-teal-300 rounded"
                    />
                    <input
                        name="zipCode"
                        type="text"
                        placeholder="CEP"
                        value={addressData.zipCode}
                        onChange={handleChange}
                        className="w-full p-2 border border-teal-300 rounded"
                    />
                    <button
                        type="submit"
                        className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded transition-colors"
                    >
                        Finalizar Pedido
                    </button>
                </form>


                <button
                    onClick={() => navigate("/orders")}
                    className="mt-6 w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded transition-colors"
                >
                    Ver Meus Pedidos
                </button>
            </div>
        </div>
    );
};

export default CheckoutPage;
