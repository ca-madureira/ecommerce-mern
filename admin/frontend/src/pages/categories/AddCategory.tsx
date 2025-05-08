import React, { useState, FormEvent, ChangeEvent } from 'react';
import axios from 'axios';
import { FaTimes } from 'react-icons/fa';

interface CategoryFormData {
    category: string;
    subcategories: string[];
}

export const AddCategory: React.FC = () => {
    const [category, setCategory] = useState<string>('');
    const [subcategory, setSubcategory] = useState<string>('');
    const [subcategories, setSubcategories] = useState<string[]>([]);

    const handleAddSubcategory = (): void => {
        if (subcategory.trim() !== '') {
            setSubcategories([...subcategories, subcategory]);
            setSubcategory('');
        }
    };

    const handleRemoveSubcategory = (index: number) => {
        const newSubcategories = [...subcategories];
        newSubcategories.splice(index, 1);
        setSubcategories(newSubcategories);
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (category.trim() === '') {
            alert('Por favor, insira uma categoria.');
            return;
        }

        const formData: CategoryFormData = {
            category,
            subcategories
        };

        try {
            const response = await axios.post('http://localhost:4000/api/categories/create', formData);
            console.log('Categoria criada com sucesso:', response.data);
            alert('Categoria criada com sucesso!');
            setCategory('');
            setSubcategories([]);
        } catch (error) {
            console.error('Erro ao criar categoria:', error);
            alert('Erro ao criar categoria. Tente novamente.');
        }
    };

    return (
        <section className="w-full max-w-md mx-auto p-6 bg-white rounded-lg mt-10">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Cadastro de Categorias</h2>

            <form onSubmit={handleSubmit}>
                <fieldset className="mb-6 border border-gray-700 rounded-md p-4">
                    <legend className="text-sm font-bold text-gray-700 px-2">Categoria</legend>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
                        Nome da Categoria:
                    </label>
                    <input
                        id="category"
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={category}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setCategory(e.target.value)}
                        placeholder="Digite o nome da categoria"
                    />
                </fieldset>

                <fieldset className="mb-6 border border-gray-700 rounded-md p-4">
                    <legend className="text-sm font-bold text-gray-700 px-2">Subcategorias</legend>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="subcategory">
                        Subcategoria:
                    </label>
                    <section className="flex">
                        <input
                            id="subcategory"
                            type="text"
                            className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={subcategory}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setSubcategory(e.target.value)}
                            placeholder="Digite uma subcategoria"
                        />
                        <button
                            type="button"
                            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-r-md cursor-pointer"
                            onClick={handleAddSubcategory}
                        >
                            Adicionar
                        </button>
                    </section>

                    {subcategories.length > 0 && (
                        <section className="mt-4">
                            <p className="text-gray-700 text-sm font-bold mb-2">Lista de Subcategorias:</p>
                            <article className="bg-gray-100 p-3 rounded-md">
                                {subcategories.map((item, index) => (
                                    <section key={index} className="flex items-center justify-between bg-white mb-2 p-2 rounded border border-gray-200">
                                        <span>{item}</span>
                                        <button
                                            type="button"
                                            className="text-red-500 hover:text-red-700"
                                            onClick={() => handleRemoveSubcategory(index)}
                                        >
                                            <FaTimes />
                                        </button>
                                    </section>
                                ))}
                            </article>
                        </section>
                    )}
                </fieldset>

                <div className="flex">
                    <button
                        type="submit"
                        className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer"
                    >
                        Cadastrar
                    </button>
                </div>
            </form>
        </section>
    );
};
