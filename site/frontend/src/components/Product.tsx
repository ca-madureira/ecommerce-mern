import { useState } from "react";
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
        <article className="flex flex-col justify-between border border-gray-200 rounded-xl shadow-sm w-34 h-[250px] p-2">
            <img
                src={currentImage}
                alt={product.name}
                className="w-34 h-42 rounded-t-xl cursor-pointer"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            />
            <div className="flex flex-col justify-between flex-1 mt-2">
                <h2 className="text-xs min-h-[2.5rem]">{product.name}</h2>
                <span className="text-xs font-bold text-teal-900">
                    R$ {product.price.toFixed(2).replace(".", ",")}
                </span>
            </div>
        </article>

    );
};
