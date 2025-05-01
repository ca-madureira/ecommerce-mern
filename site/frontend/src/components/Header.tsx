import { HiShoppingBag } from "react-icons/hi";
import { BsSearchHeartFill } from "react-icons/bs";
import { FaUser } from "react-icons/fa";
import { useState, FormEvent } from "react";
import { Link } from "react-router-dom";

import { useAppDispatch } from "../store/hooks";

import { setSearchTerm } from "../store/slices/searchSlice";

export const Header = () => {
    const dispatch = useAppDispatch();
    const [inputValue, setInputValue] = useState("");

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        dispatch(setSearchTerm(inputValue));
        setInputValue("")
    };

    return (
        <header className="flex items-center justify-between px-6 py-3 bg-teal-300">
            <div className="flex items-center space-x-2">
                <HiShoppingBag className="w-8 h-8 text-white" />
            </div>

            <form
                className="flex flex-1 mx-6 border border-white rounded-md overflow-hidden"
                onSubmit={handleSubmit}
            >
                <input
                    type="search"
                    placeholder="Buscar produtos..."
                    className="w-full px-4 py-2 outline-none placeholder-white focus:ring-2 focus:ring-amber-500"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />
                <button
                    type="submit"
                    className="bg-teal-300 px-2 cursor-pointer flex items-center justify-center"
                    aria-label="Buscar"
                >
                    <BsSearchHeartFill className="text-white w-6 h-6" />
                </button>
            </form>

            <div className="flex items-center space-x-2 cursor-pointer">
                <FaUser className="text-white" />
                <Link to="/login" className="hidden md:flex text-white font-semibold">Entrar</Link>
            </div>
        </header>
    );
};
