import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

const Layout = () => {
    return (
        <div className="flex">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="ml-64 w-full p-6 bg-gray-900 min-h-screen text-white">
                <Outlet />
            </div>
        </div>
    );
};

export default Layout;
