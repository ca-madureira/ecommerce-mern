import { useState, useEffect } from "react"
import axios from "axios"
import { Product } from "../../interfaces/Product"
import { IoIosRemoveCircle } from "react-icons/io";

export const ListProduct = () => {
    const [list, setList] = useState<Product[]>([])

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get("http://localhost:4000/api/products/");
                console.log(response.data);
                setList(response.data);
                console.log('eu existo', response.data);
            } catch (error) {
                console.error("Erro ao buscar produtos:", error);
            }
        };

        fetchProducts();
    }, []);

    const removeProduct = async (id: string) => {
        try {
            await axios.delete(`http://localhost:4000/api/products/${id}`);
            setList(prev => prev.filter(item => item._id !== id));
        } catch (error) {
            console.error("Erro ao remover produto:", error);
        }
    };


    return (
        <section className="flex flex-col justify-center px-6 mt-12">
            <h1 className="text-2xl font-bold mb-6 text-center text-gray-800"> Lista de Produtos</h1>

            <table className="">
                <thead className="bg-gray-800 text-white">
                    <tr>
                        <th className="p-2 border-1 border-gray-800">Imagem</th>
                        <th className="p-2 border-1 border-gray-800">Nome</th>
                        <th className="p-2 border-1 border-gray-800">Descrição</th>
                        <th className="p-2 border-1 border-gray-800">Categoria</th>
                        <th className="p-2 border-1 border-gray-800">Subcategoria</th>
                        <th className="p-2 border-1 border-gray-800">Tamanhos</th>
                        <th className="p-2 border-1 border-gray-800">Preço</th>
                        <th className="p-2 border-1 border-gray-800">Estoque</th>
                        <th className="p-2 border-1 border-gray-800">Ação</th>
                    </tr>
                </thead>
                <tbody>
                    {list.map((product: Product) => (
                        <tr key={product._id} className="text-center hover:bg-gray-50">
                            <td className="p-2 border-1 border-zinc-300 text-center align-middle">
                                <img src={product.images[0]} alt={product.name} className="w-10 h-10 rounded-md inline-block" />
                            </td>
                            <td className="p-2 border-1 border-zinc-300 text-xs">{product.name}</td>
                            <td className="p-2 border-1 border-zinc-300 text-xs">{product.description}</td>
                            <td className="p-2 border-1 border-zinc-300 text-xs ">{product.category}</td>
                            <td className="p-2 border-1 border-zinc-300 text-xs">{product.subCategory}</td>
                            <td className="p-2 border-1 border-zinc-300 text-xs">{product.sizes.join(', ')}</td>
                            <td className="p-2 border-1 border-zinc-300 text-xs  whitespace-nowrap">R$ {product.price.toFixed(2).replace(".", ",")}</td>
                            <td className="p-2 border-1 border-zinc-300 text-xs">{product.stock}</td>
                            <td className="p-2 border border-zinc-300 text-center align-middle">
                                <IoIosRemoveCircle
                                    className="text-red-500 w-6 h-6 inline-block cursor-pointer"
                                    onClick={() => removeProduct(product._id)}
                                />
                            </td>
                        </tr>
                    ))}

                    {list.length === 0 && (
                        <tr>
                            <td colSpan={9} className="py-4 px-6 text-center text-gray-500">
                                Nenhum produto cadastrado
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </section>
    )
}
