import { useState } from 'react';
import { Link } from 'react-router-dom';

type SubMenuItem = {
    name: string;
    path: string;
};

type MenuItem = {
    name: string;
    subItems: SubMenuItem[];
    isOpen: boolean;
};

const Sidebar = () => {
    const [menuItems, setMenuItems] = useState<MenuItem[]>([
        {
            name: "Produtos",
            subItems: [
                { name: "Listar Produtos", path: "/products" },
                { name: "Criar Produto", path: "/products/create" }
            ],
            isOpen: false
        },
        {
            name: "Categorias",
            subItems: [
                { name: "Listar Categorias", path: "/categories" },
                { name: "Criar Categoria", path: "/categories/create" }
            ],
            isOpen: false
        }
    ]);

    const toggleSubmenu = (index: number) => {
        const updatedMenuItems = [...menuItems];
        updatedMenuItems[index].isOpen = !updatedMenuItems[index].isOpen;
        setMenuItems(updatedMenuItems);
    };

    return (
        <aside className="w-64 h-screen bg-gray-800 text-white fixed left-0 top-0">
            <div className="p-4 border-b border-gray-700">
                <h2 className="text-xl font-bold">Admin Panel</h2>
            </div>

            <nav className="mt-4">
                <ul>
                    {menuItems.map((item, index) => (
                        <li key={index} className="mb-2">
                            <button
                                className="flex items-center justify-between w-full px-4 py-2 hover:bg-gray-700 focus:outline-none"
                                onClick={() => toggleSubmenu(index)}
                            >
                                <span>{item.name}</span>
                                <svg
                                    className={`w-4 h-4 transition-transform ${item.isOpen ? "transform rotate-180" : ""}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </button>

                            {item.isOpen && (
                                <ul className="pl-6 mt-1">
                                    {item.subItems.map((subItem, subIndex) => (
                                        <li key={subIndex}>
                                            <Link
                                                to={subItem.path}
                                                className="block px-4 py-2 hover:bg-gray-700"
                                            >
                                                {subItem.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;
