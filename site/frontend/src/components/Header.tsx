import { HiShoppingBag } from "react-icons/hi";
import { BsSearchHeartFill } from "react-icons/bs";
import { FaUser } from "react-icons/fa";

export const Header = () => {
    return (
        <header className="flex items-center justify-between px-6 py-3 bg-teal-300">

            <div className="flex items-center space-x-2">
                <HiShoppingBag className="w-8 h-8 text-white" />

            </div>


            <form className="flex flex-1 mx-6 border border-white rounded-md overflow-hidden">
                <input
                    type="search"
                    placeholder="Buscar produtos..."
                    className="w-full px-4 py-2 outline-none placeholder-white focus:ring-2 focus:ring-amber-500"
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
                <span className="hidden md:flex text-white font-semibold">Entrar / Registro</span>
            </div>
        </header>
    );
};
