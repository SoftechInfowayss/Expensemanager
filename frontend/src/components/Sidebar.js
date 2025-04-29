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
                <h2 className="text-2xl font-bold text-white mb-8">
                    User Dashboard
                </h2>
                <ul>
                    <li className="mb-3">
                        <NavLink
                            to="/user/"
                            className="sidebar-link"
                            activeClassName="active-link"
                            onClick={closeSidebar}
                        >
                            <i className="fas fa-home mr-3"></i>
                            Dashboard
                        </NavLink>
                    </li>
                    <li className="mb-3">
                        <NavLink
                            to="/user/add-transaction"
                            className="sidebar-link"
                            activeClassName="active-link"
                            onClick={closeSidebar}
                        >
                            <i className="fas fa-plus-circle mr-3"></i>
                            Add Transaction
                        </NavLink>
                    </li>
                    <li className="mb-3">
                        <NavLink
                            to="/user/profile"
                            className="sidebar-link"
                            activeClassName="active-link"
                            onClick={closeSidebar}
                        >
                            <i className="fas fa-user mr-3"></i>
                            Profile
                        </NavLink>
                    </li>
                    <li className="mb-3">
                        <NavLink
                            to="/user/advice"
                            className="sidebar-link"
                            activeClassName="active-link"
                            onClick={closeSidebar}
                        >
                            <i className="fas fa-lightbulb mr-3"></i>
                            Finance Advice
                        </NavLink>
                    </li>
                </ul>
            </div>

            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-70 z-40 md:hidden animate-fade-in"
                    onClick={toggleSidebar}
                />
            )}
        </>
    );
};

export default Sidebar;