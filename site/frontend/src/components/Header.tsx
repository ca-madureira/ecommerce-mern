import { HiShoppingBag } from "react-icons/hi";
import { BsSearchHeartFill } from "react-icons/bs";
import { FaUser } from "react-icons/fa";

export const Header = () => {
    return (
        <header className="flex items-center justify-between px-6 py-3 border-b border-gray-200 bg-white">

            <div className="flex items-center space-x-2">
                <HiShoppingBag className="w-8 h-8 text-amber-500" />
                <span className="hidden md:flex text-xl font-bold text-amber-600">Loja</span>
            </div>


            <form className="flex flex-1 mx-6 border border-orange-400 rounded-md overflow-hidden">
                <input
                    type="search"
                    placeholder="Buscar produtos..."
                    className="w-full px-4 py-2 outline-none focus:ring-2 focus:ring-amber-500"
                />
                <button
                    type="submit"
                    className="bg-orange-100 px-2 cursor-pointer flex items-center justify-center"
                    aria-label="Buscar"
                >
                    <BsSearchHeartFill className="text-amber-500 w-6 h-6" />
                </button>
            </form>


            <div className="flex items-center space-x-2 cursor-pointer">
                <FaUser className="text-amber-500" />
                <span className="hidden md:flex text-amber-600 font-semibold text-sm">Entrar / Registro</span>
            </div>
        </header>
    );
};
