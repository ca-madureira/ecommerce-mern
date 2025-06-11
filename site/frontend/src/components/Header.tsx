import { HiShoppingBag } from "react-icons/hi";
import { BsSearchHeartFill } from "react-icons/bs";
import { FaUser } from "react-icons/fa";
import { useState, FormEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setSearchTerm } from "../store/slices/searchSlice";
import { selectCartItemCount } from "../store/slices/cartSlice";

export const Header = () => {
    const dispatch = useAppDispatch();
    const [inputValue, setInputValue] = useState("");
    const location = useLocation();
    const hideSearch = location.pathname === "/cart" || location.pathname.includes('/product') || location.pathname === '/checkout' || location.pathname === '/orders';

    const itemCount = useAppSelector(selectCartItemCount);
    const user = useAppSelector((state) => state.auth.user);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        dispatch(setSearchTerm(inputValue));
        setInputValue("");
    };

    return (
        <header className="flex items-center justify-between px-6 py-3 bg-teal-300">
            <Link to="/" className="hidden md:flex text-white font-bold text-xl cursor-pointer">LookNaModa</Link>

            {!hideSearch && (
                <form
                    className="flex flex-1 mx-6 border border-white rounded-md overflow-hidden max-w-xl"
                    onSubmit={handleSubmit}
                >
                    <input
                        type="search"
                        placeholder="Buscar produtos..."
                        className="w-full px-4 py-2 outline-none placeholder-white bg-teal-300 text-white"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="bg-teal-300 px-2 flex items-center justify-center"
                        aria-label="Buscar"
                    >
                        <BsSearchHeartFill className="text-white w-6 h-6" />
                    </button>
                </form>
            )}

            <div className="flex items-center space-x-4">
                {user && user.name ? (
                    <Link to="/address" className="text-white font-semibold flex items-center space-x-1">
                        <FaUser />
                        <span className="hidden md:inline">{user.name}</span>
                    </Link>
                ) : (
                    <Link to="/login" className="flex items-center space-x-1 text-white font-semibold">
                        <span className="hidden md:inline">Entrar</span>
                        <FaUser className="w-6 h-6" />

                    </Link>
                )}

                <Link to="/cart" className="relative">
                    <HiShoppingBag className="w-8 h-8 text-white" />
                    {itemCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                            {itemCount}
                        </span>
                    )}
                </Link>
            </div>
        </header>
    );
};