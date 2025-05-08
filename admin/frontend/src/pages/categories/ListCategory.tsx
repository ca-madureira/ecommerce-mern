import { useEffect, useState } from "react";
import { IoIosRemoveCircle } from "react-icons/io";
import axios from "axios";
import { Category } from "../../interfaces/Category";


export const ListCategory = () => {
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        const getAllCategories = async () => {
            try {
                const response = await axios.get("http://localhost:4000/api/categories/");
                setCategories(response.data);
            } catch (error) {
                console.error("Erro ao buscar categorias:", error);
            }
        };

        getAllCategories();
    }, []);

    const removeCategory = async (id: string) => {
        try {
            await axios.delete(`http://localhost:3000/api/categories/${id}`);
            setCategories(prev => prev.filter(category => category._id !== id));
        } catch (error) {
            console.error("Erro ao remover categoria:", error);
            alert("Erro ao remover categoria. Tente novamente.");
        }
    };

    return (
        <section className="flex flex-col items-center w-full max-w-4xl mx-auto p-6 bg-white rounded-lg mt-10">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Lista de Categorias</h2>


            <table>
                <thead className="bg-gray-800 text-white">
                    <tr className="rounded-t-md">
                        <th className="p-2 border-1 border-gray-800">Categoria</th>
                        <th className="py-3 px-6 text-left border-1 border-gray-800">Subcategorias</th>
                        <th className="py-3 px-6 text-left border-1 border-gray-800">Ação</th>
                    </tr>
                </thead>

                <tbody>
                    {categories.map((cat) => (
                        <tr key={cat._id} className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="py-3 px-6 text-gray-700">{cat.name}</td>
                            <td className="py-3 px-6 text-gray-700">
                                <ul className="list-disc list-inside space-y-1">
                                    {cat.subcategories.map((subcategory, subIndex) => (
                                        <li key={subIndex}>{subcategory}</li>
                                    ))}
                                </ul>
                            </td>
                            <td className="py-3 px-6 flex justify-center items-center">
                                <IoIosRemoveCircle
                                    className="w-6 h-6 text-red-500 cursor-pointer hover:text-red-600"
                                    title="Remover categoria"
                                    role="button"
                                    aria-label="Remover categoria"
                                    onClick={() => removeCategory(cat._id)}
                                />
                            </td>
                        </tr>
                    ))}

                    {categories.length === 0 && (
                        <tr>
                            <td colSpan={3} className="py-4 px-6 text-center text-gray-500">
                                Nenhuma categoria cadastrada.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

        </section>
    );
};
