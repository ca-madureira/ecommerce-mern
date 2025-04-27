import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export const Layout = () => {
    return (
        <section className="flex">
            <Sidebar />
            <main className="ml-64 flex-1">
                <Outlet />
            </main>
        </section>
    );
};

