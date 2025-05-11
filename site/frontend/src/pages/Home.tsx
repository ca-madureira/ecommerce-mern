import { useEffect, useState } from "react";
import { FaChevronDown } from "react-icons/fa6";
import axios from "axios";
import { Product } from "../components/Product";
import { ProductType, Category } from "../types";

import { useAppSelector } from "../store/hooks";

export const Home = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [openCategory, setOpenCategory] = useState<Record<string, boolean>>({});
    const [products, setProducts] = useState<ProductType[]>([]);
    const searchTerm = useAppSelector((state) => state.search.searchTerm);

    const [selectedFilters, setSelectedFilters] = useState<{
        categoryId: string;
        subcategory: string;
    }[]>([]);

    const getAllCategories = () => {
        axios
            .get("http://localhost:4000/api/categories/")
            .then((response) => setCategories(response.data))
            .catch((error) => console.error("Erro ao buscar categorias:", error));
    };

    const getAllProducts = () => {
        axios
            .get("http://localhost:4000/api/products/")
            .then((response) => setProducts(response.data))
            .catch((error) => console.error("Erro ao buscar produtos:", error));
    };

    const handleSubcategoryChange = (categoryId: string, subcategory: string, checked: boolean) => {
        if (checked) {
            setSelectedFilters((prev) => [...prev, { categoryId, subcategory }]);
        } else {
            setSelectedFilters((prev) =>
                prev.filter(
                    (filter) =>
                        !(filter.categoryId === categoryId && filter.subcategory === subcategory)
                )
            );
        }
    };

    const isSubcategorySelected = (categoryId: string, subcategory: string) => {
        return selectedFilters.some(
            (filter) => filter.categoryId === categoryId && filter.subcategory === subcategory
        );
    };

    useEffect(() => {
        getAllCategories();
        getAllProducts();
    }, []);

    const toggleCategory = (categoryId: string) => {
        setOpenCategory((prev) => ({
            ...prev,
            [categoryId]: !prev[categoryId],
        }));
    };

    const filteredProducts = products.filter((product) => {
        const matchesSearch =
            searchTerm === "" ||
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.subCategory.toLowerCase().includes(searchTerm.toLowerCase());

        if (!matchesSearch) return false;

        if (selectedFilters.length === 0) return true;

        const productCategory = categories.find((cat) => cat.name === product.category);
        if (!productCategory) return false;

        return selectedFilters.some(
            (filter) =>
                filter.categoryId === productCategory._id &&
                filter.subcategory === product.subCategory
        );
    });

    return (
        <section className="flex flex-col items-center justify-center bg-zinc-50">
            <section className="w-full h-16 flex">
                <section className="bg-teal-100 w-full flex flex-col gap-4 pl-2">
                    <h1 className="text-teal-700 font-bold text-sm">Categorias</h1>
                    <ul className="flex gap-6 relative">
                        {categories.map((category) => (
                            <li key={category._id} className="relative">
                                <div className="flex gap-2 items-center cursor-pointer">
                                    <span className="text-xs">{category.name}</span>
                                    <FaChevronDown
                                        className="text-xs"
                                        onClick={() => toggleCategory(category._id)}
                                    />
                                </div>

                                {openCategory[category._id] && (
                                    <ul className="absolute flex flex-col gap-1 top-full left-0 bg-white border border-teal-200 w-[250px] p-2 mt-2 z-10 shadow-md">
                                        {category.subcategories.map((subcategory) => (
                                            <li
                                                key={`${category._id}-${subcategory}`}
                                                className="flex gap-2 items-center text-xs mb-1"
                                            >
                                                <input
                                                    type="checkbox"
                                                    id={`subcategory-${category._id}-${subcategory}`}
                                                    name={subcategory}
                                                    value={subcategory}
                                                    onChange={(e) =>
                                                        handleSubcategoryChange(
                                                            category._id,
                                                            subcategory,
                                                            e.target.checked
                                                        )
                                                    }
                                                    checked={isSubcategorySelected(category._id, subcategory)}
                                                />
                                                <label htmlFor={`subcategory-${category._id}-${subcategory}`}>
                                                    {subcategory}
                                                </label>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        ))}
                    </ul>
                </section>
            </section>


            <div className="w-full px-4 my-4">
                <h2 className="text-lg font-semibold text-teal-700">
                    {searchTerm ? `Resultados para "${searchTerm}"` : "Todos os produtos"}
                    <span className="text-sm font-normal ml-2">
                        ({filteredProducts.length} produtos)
                    </span>
                </h2>
            </div>


            <section className="flex flex-wrap justify-center space-y-6 gap-4">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                        <Product key={product._id} product={product} />
                    ))
                ) : (
                    <div className="">
                        <p className="text-xl">Nenhum produto encontrado</p>
                        <p className="text-sm mt-2">
                            Tente ajustar seus filtros ou termos de busca
                        </p>
                    </div>
                )}
            </section>
        </section>
    );
};
