import { useState, ChangeEvent, useEffect } from 'react';
import upload from '../../assets/icon.png';
import axios from 'axios';
import { Category } from '../../interfaces/Category';

export const AddProduct = () => {
    const [image1, setImage1] = useState<File | null>(null);
    const [image2, setImage2] = useState<File | null>(null);
    const [image3, setImage3] = useState<File | null>(null);
    const [image4, setImage4] = useState<File | null>(null);

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [categories, setCategories] = useState<Category[]>([]);
    const [category, setCategory] = useState('');
    const [subCategory, setSubCategory] = useState('');
    const [stock, setStock] = useState(0);
    const [sizes, setSizes] = useState<string[]>([]);

    const handleImageChange = (
        e: ChangeEvent<HTMLInputElement>,
        setImage: React.Dispatch<React.SetStateAction<File | null>>
    ) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('category', category);
        formData.append('subCategory', subCategory);
        formData.append('stock', stock.toString());
        formData.append('sizes', JSON.stringify(sizes));

        if (image1) formData.append('image1', image1);
        if (image2) formData.append('image2', image2);
        if (image3) formData.append('image3', image3);
        if (image4) formData.append('image4', image4);

        try {
            await axios.post('http://localhost:4000/api/products/create', formData);
            alert('Produto criado com sucesso!');
            setImage1(null);
            setImage2(null);
            setImage3(null);
            setImage4(null);
            setName('');
            setDescription('');
            setCategory('');
            setSubCategory('');
            setPrice('');
            setSizes([]);
            setStock(0);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSelectSize = (e: ChangeEvent<HTMLInputElement>, size: string) => {
        if (e.target.checked) {
            setSizes([...sizes, size]);
        } else {
            setSizes(sizes.filter((s) => s !== size));
        }
    }

    const handleSelectCategory = (e: ChangeEvent<HTMLSelectElement>) => {
        setCategory(e.target.value);
        setSubCategory('');
    }

    useEffect(() => {
        const getCategories = async () => {
            try {
                const res = await axios.get('http://localhost:4000/api/categories/');
                setCategories(res.data);
            } catch (err) {
                console.error('Erro ao buscar categorias:', err);
            }
        };
        getCategories();
    }, []);

    const selectedCategory = categories.find((cat) => cat.name === category);
    const subcategories = selectedCategory?.subcategories ?? [];

    return (
        <section className="max-w-2xl mx-auto py-8 px-4">
            <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Adicionar Novo Produto</h1>

            <form className="space-y-6" onSubmit={handleSubmit}>

                <fieldset className="border border-gray-700 rounded-md p-4">
                    <legend className="block text-gray-700 text-sm font-bold mb-2">Carregar imagem</legend>
                    <section className="flex gap-2 pt-2">
                        {[image1, image2, image3, image4].map((img, i) => {
                            const setters = [setImage1, setImage2, setImage3, setImage4];
                            return (
                                <label htmlFor={`image${i + 1}`} key={i} className="cursor-pointer">
                                    <img
                                        src={img ? URL.createObjectURL(img) : upload}
                                        alt={`Upload da imagem ${i + 1}`}
                                        className="w-16 h-16 aspect-square object-cover ring-1 ring-slate-900/5 rounded-lg"
                                    />
                                    <input
                                        type="file"
                                        hidden
                                        accept="image/*"
                                        onChange={(e) => handleImageChange(e, setters[i])}
                                        id={`image${i + 1}`}
                                    />
                                </label>
                            );
                        })}
                    </section>
                </fieldset>

                <fieldset className="border border-gray-700 rounded-md p-4">
                    <legend className="block text-gray-700 text-sm font-bold mb-2">Informações do Produto</legend>

                    <section className="space-y-4">
                        <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-1">
                            Nome:
                        </label>
                        <input
                            type="text"
                            id="name"
                            placeholder="Nome do Produto"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-3 py-2 ring-1 ring-slate-900/10 rounded bg-white"
                            required
                        />

                        <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-1">
                            Descrição:
                        </label>
                        <textarea
                            id="description"
                            placeholder="Descrição"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-3 py-2 ring-1 ring-slate-900/10 rounded bg-white min-h-24"
                            required
                        />

                        <label htmlFor="price" className="block text-gray-700 text-sm font-bold mb-1">
                            Preço:
                        </label>
                        <input
                            type="text"
                            id="price"
                            placeholder="Preço"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="w-full px-3 py-2 ring-1 ring-slate-900/10 rounded bg-white"
                            required
                        />

                        <label htmlFor="stock" className="block text-gray-700 text-sm font-bold mb-1">
                            Estoque:
                        </label>
                        <input
                            type="number"
                            id="stock"
                            placeholder="Estoque"
                            value={stock}
                            onChange={(e) => setStock(parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 ring-1 ring-slate-900/10 rounded bg-white"
                            required
                        />
                    </section>
                </fieldset>

                <fieldset className="border border-gray-700 rounded-md p-4">
                    <legend className="block text-gray-700 text-sm font-bold mb-2">Categorização</legend>

                    <article className="grid grid-cols-2 gap-4">
                        <section>
                            <label htmlFor="category" className="block text-gray-700 text-sm font-bold mb-2">
                                Categoria:
                            </label>
                            <select
                                id="category"
                                value={category}
                                onChange={(e) => handleSelectCategory(e)}
                                className="w-full px-3 py-2 ring-1 ring-slate-900/10 bg-white rounded"
                                required
                            >
                                <option value="">Selecione uma categoria</option>
                                {categories.map((cat) => (
                                    <option key={cat._id} value={cat.name}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </section>

                        <section>
                            <label htmlFor="subcategory" className="block text-gray-700 text-sm font-bold mb-2">
                                Subcategoria:
                            </label>
                            <select
                                id="subcategory"
                                value={subCategory}
                                onChange={(e) => setSubCategory(e.target.value)}
                                disabled={subcategories.length === 0}
                                className="w-full px-3 py-2 ring-1 ring-slate-900/10 bg-white rounded"
                                required
                            >

                                <option value="">Nenhuma subcategoria disponível</option>
                                {subcategories.map((sub: string, idx: number) => (
                                    <option key={idx} value={sub}>
                                        {sub}
                                    </option>
                                ))
                                }
                            </select>
                        </section>
                    </article>
                </fieldset>

                <fieldset className="border border-gray-700 rounded-md p-4">
                    <legend className="block text-gray-700 text-sm font-bold mb-2">Tamanhos Disponíveis</legend>
                    <section className="flex flex-wrap gap-2">
                        {['P', 'M', 'G', 'GG'].map((size) => (
                            <label key={size} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    value={size}
                                    checked={sizes.includes(size)}
                                    onChange={(e) => handleSelectSize(e, size)}
                                    className="rounded"
                                />
                                <span>{size}</span>
                            </label>
                        ))}
                    </section>
                </fieldset>

                <button
                    type="submit"
                    className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer"
                >
                    Adicionar Produto
                </button>
            </form>
        </section>
    );
};
