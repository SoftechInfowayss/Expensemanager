import { NavLink } from "react-router-dom";
import './Sidebar.css';

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const closeSidebar = () => {
        console.log("Sidebar close called");
        toggleSidebar();
    };

    return (
        <>
            <div
                className={`sidebar ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
                md:translate-x-0 transition-transform duration-300 ease-in-out`}
            >
                <h2 className="text-2xl font-bold text-blue-300 mb-6">
                    User Dashboard
                </h2>
                <ul>
                    <li className="mb-4">
                        <NavLink
                            to="/user/"
                            className="sidebar-link"
                            activeClassName="active-link"
                            onClick={closeSidebar}
                        >
                            Dashboard
                        </NavLink>
                    </li>
                    <li className="mb-4">
                        <NavLink
                            to="/user/add-transaction"
                            className="sidebar-link"
                            activeClassName="active-link"
                            onClick={closeSidebar}
                        >
                            Add Transaction
                        </NavLink>
                    </li>
                    <li className="mb-4">
                        <NavLink
                            to="/user/profile"
                            className="sidebar-link"
                            activeClassName="active-link"
                            onClick={closeSidebar}
                        >
                            Profile
                        </NavLink>
                    </li>
                </ul>
            </div>

            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                    onClick={toggleSidebar}
                />
            )}
        </>
    );
};

export default Sidebar;