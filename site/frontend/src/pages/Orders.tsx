import { useEffect, useState } from "react";
import axios from "axios";

type Order = {
    _id: string;
    orderNumber: string;
    total: number;
    paymentMethod: string;
    createdAt: string;
    shippingAddress: {
        street: string;
        number: string;
        city: string;
        state: string;
        zipCode: string;
    };
};

const Orders = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    console.error("Token não encontrado.");
                    return;
                }

                const response = await axios.get("http://localhost:4000/api/payments/orders/all", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setOrders(response.data.orders);
            } catch (error) {
                console.error("Erro ao buscar pedidos:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) {
        return (
            <section role="status" className="text-center mt-10 text-gray-600">
                Carregando pedidos...
            </section>
        );
    }

    return (
        <main className="max-w-4xl mx-auto mt-10 px-4">
            <h1 className="text-2xl font-bold mb-6 text-center">Meus Pedidos</h1>

            {orders.length === 0 ? (
                <p className="text-center text-gray-500">Nenhum pedido encontrado.</p>
            ) : (
                <section className="space-y-6" aria-label="Lista de pedidos">
                    {orders.map((order) => (
                        <article
                            key={order._id}
                            className="bg-white shadow-md rounded-xl p-6 border border-gray-200"
                        >
                            <header className="flex justify-between items-center mb-4">
                                <span className="text-sm text-gray-600">Pedido</span>
                                <time
                                    className="text-sm text-gray-500"
                                    dateTime={order.createdAt}
                                >
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </time>
                            </header>

                            <h2 className="text-lg font-semibold text-teal-600">
                                #{order.orderNumber}
                            </h2>

                            <p className="text-gray-700 mt-2">
                                Total:{" "}
                                <span className="font-semibold">
                                    R$ {order.total.toFixed(2)}
                                </span>
                            </p>

                            <p className="text-gray-700">Pagamento: {order.paymentMethod}</p>

                            <address className="not-italic text-gray-600 mt-2">
                                <p>
                                    Entrega: {order.shippingAddress.street},{" "}
                                    {order.shippingAddress.number}
                                </p>
                                <p>
                                    {order.shippingAddress.city} - {order.shippingAddress.state},{" "}
                                    {order.shippingAddress.zipCode}
                                </p>
                            </address>
                        </article>
                    ))}
                </section>
            )}
        </main>
    );
};

export default Orders;
