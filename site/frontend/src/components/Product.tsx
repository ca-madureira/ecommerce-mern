import { useState } from "react";
import { Link } from "react-router-dom"; // Importa o Link
import { ProductType } from "../types";

interface ProductProps {
    product: ProductType;
}

export const Product = ({ product }: ProductProps) => {
    const [currentImage, setCurrentImage] = useState(product.images[0]);

    const handleMouseEnter = () => {
        if (product.images.length > 1) {
            setCurrentImage(product.images[1]);
        }
    };

    const handleMouseLeave = () => {
        setCurrentImage(product.images[0]);
    };

    return (
        <Link to={`/product/${product._id}`}>
            <article className="flex flex-col justify-between bg-white hover:border-teal-500 hover:border rounded-xl shadow-sm w-38 md:w-48 p-2 hover:shadow-md transition-shadow duration-300">
                <img
                    src={currentImage}
                    alt={product.name}
                    className="h-48 rounded-t-xl cursor-pointer"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                />
                <div className="flex flex-col justify-between flex-1 mt-2">
                    <h2 className="text-sm text-gray-800 font-medium min-h-[2.5rem]">{product.name}</h2>
                    <span className="text-sm font-bold text-teal-900">
                        R$ {product.price.toFixed(2).replace(".", ",")}
                    </span>
                </div>
            </article>
        </Link>
    );
};
