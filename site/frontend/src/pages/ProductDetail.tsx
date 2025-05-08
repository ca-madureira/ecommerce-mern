import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/cartAPI";
import { ProductType } from "../types";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { addItemToCart, fetchCart } from "../store/slices/cartSlice";
import { CartModal } from "../components/CartModal";
import axios from "axios";

export const ProductDetail = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const cart = useAppSelector(state => state.cart.cart);
    const cartStatus = useAppSelector(state => state.cart.status);

    const { productId } = useParams<{ productId: string }>();
    const [product, setProduct] = useState<ProductType | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [image, setImage] = useState("");
    const [sizeSelected, setSizeSelected] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [lastAddedId, setLastAddedId] = useState<string>("");
    const [showSizeWarning, setShowSizeWarning] = useState(false);
    const [addingToCart, setAddingToCart] = useState(false);

    // Carregar o carrinho quando o componente for montado
    useEffect(() => {
        dispatch(fetchCart());
    }, [dispatch]);

    // Carregar o carrinho quando o componente for montado
    useEffect(() => {
        dispatch(fetchCart());
    }, [dispatch]);

    const fetchProduct = async () => {
        setLoading(true);
        setError("");

        try {
            const response = await axios.get(`http://localhost:4000/api/products/${productId}`);
            if (response.data) {
                setProduct(response.data);
                setImage(response.data.images[0]);
            } else {
                setError("Dados do produto não encontrados");
            }
        } catch (error: any) {
            if (error.response?.status === 404) {
                setError(`Produto não encontrado (ID: ${productId})`);
            } else {
                setError(`Erro: ${error.response?.data?.message || error.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (productId) {
            fetchProduct();
        }
    }, [productId]);

    const handleAddToCart = async () => {
        if (!product || !sizeSelected) {
            setShowSizeWarning(!sizeSelected);
            return;
        }

        setShowSizeWarning(false);
        setAddingToCart(true);

        const cartItem = {
            product: {
                _id: product._id,
                name: product.name,
                description: product.description,
                image: image || product.images[0],
                price: product.price,
            },
            quantity: 1,
            size: sizeSelected,
        };

        try {


            // 2. Sincronização com o backend
            await dispatch(addItemToCart({
                productId: product._id,
                quantity: 1,
                size: sizeSelected
            })).unwrap();

            // 3. Verificar se o item realmente foi adicionado
            await dispatch(fetchCart()).unwrap();

            // 4. Feedback visual
            setLastAddedId(product._id);
            setShowModal(true);
        } catch (error) {
            console.error("Erro ao adicionar ao carrinho:", error);
            // Aqui você poderia adicionar um toast de erro
        } finally {
            setAddingToCart(false);
        }
    };

    if (loading) return <div className="text-center mt-4">Carregando...</div>;
    if (error) return <div className="text-center mt-4 text-red-500">{error}</div>;
    if (!product) return <div className="text-center mt-4">Produto não encontrado</div>;

    return (
        <>
            <section className="flex flex-col lg:flex-row lg:justify-between lg:items-start lg:max-w-7xl lg:mx-auto lg:px-4 lg:py-6 gap-4">
                {/* Seção de imagens */}
                <div className="flex ml-2 mt-2 lg:w-1/2">
                    <aside className="w-[18%] flex flex-col gap-3">
                        {product.images.map((img, index) => (
                            <div key={index}>
                                <img
                                    onClick={() => setImage(img)}
                                    src={img}
                                    alt={`Miniatura ${index + 1}`}
                                    className="w-full h-20 object-cover object-center rounded-md cursor-pointer border-2 border-teal-600 hover:border-teal-400"
                                />
                            </div>
                        ))}
                    </aside>
                    <div className="w-[82%] pl-4 flex items-center justify-center">
                        <img
                            src={image}
                            alt={product.name}
                            className="w-full max-h-[75vh] object-contain rounded-lg"
                        />
                    </div>
                </div>

                {/* Seção de detalhes do produto */}
                <div className="flex flex-col w-full lg:w-1/2 p-4 lg:p-6 space-y-4 lg:border-l lg:pl-8">
                    <div className="border-b pb-4">
                        <h1 className="text-2xl lg:text-3xl font-bold mb-2">{product.name}</h1>
                        <p className="text-xl lg:text-2xl text-teal-800 font-semibold">
                            {product.price !== undefined
                                ? `R$ ${product.price.toFixed(2).replace(".", ",")}`
                                : "Preço indisponível"}
                        </p>
                    </div>

                    <div className="py-2">
                        <h2 className="text-lg font-medium mb-2">Descrição do Produto</h2>
                        <p className="text-sm lg:text-base text-gray-700">
                            {product.description || "Sem descrição disponível."}
                        </p>
                    </div>

                    <div className="py-2">
                        <h2 className="text-lg font-medium mb-3">Tamanhos Disponíveis</h2>
                        <div className="flex gap-3 flex-wrap">
                            {product.sizes.map((size) => (
                                <button
                                    key={size}
                                    type="button"
                                    className={`px-3 py-2 rounded-md border-2 border-teal-600 cursor-pointer transition-colors
                                        ${sizeSelected === size ? "bg-teal-600 text-white" : "text-teal-600 hover:bg-teal-50"}
                                    `}
                                    onClick={() => {
                                        setSizeSelected(size);
                                        setShowSizeWarning(false);
                                    }}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                        {showSizeWarning && (
                            <p className="text-red-500 text-sm mt-2">
                                Por favor, selecione um tamanho antes de adicionar ao carrinho.
                            </p>
                        )}
                    </div>

                    <div className="pt-4 lg:pt-6">
                        <button
                            type="button"
                            className={`bg-teal-600 text-white py-3 px-6 rounded-lg hover:bg-teal-700 w-full lg:w-2/3 font-medium text-lg transition-colors ${addingToCart ? 'opacity-75 cursor-not-allowed' : ''}`}
                            onClick={handleAddToCart}
                            disabled={addingToCart || cartStatus === 'loading'}
                        >
                            {addingToCart ? 'Adicionando...' : 'Adicionar ao carrinho'}
                        </button>

                        <div className="mt-4 text-sm text-gray-600 flex flex-col sm:flex-row sm:justify-between border-t pt-3 gap-2">
                            <span>Frete grátis acima de R$ 500,00</span>
                            <span>Entrega em 3-5 dias úteis</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Modal de confirmação */}
            {showModal && (
                <CartModal
                    visible={showModal}
                    onClose={() => {
                        setShowModal(false);
                        navigate("/cart");
                    }}
                    productId={lastAddedId}
                />
            )}
        </>
    );
};