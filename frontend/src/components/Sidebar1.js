import { Link } from "react-router-dom";
import './Sidebar.css'; 
const Sidebar = () => {
    return (
        <div className="w-64 bg-gray-900 h-screen text-white p-6 fixed top-0 left-0">
            <h2 className="text-2xl font-bold text-blue-400 mb-6">Dashboard</h2>
            <ul>
                <li className="mb-4"><Link to="/user/" className="hover:text-blue-400 transition">Dashboard</Link></li>
                <li className="mb-4"><Link to="/user/add-transaction" className="hover:text-blue-400 transition">Add Transaction</Link></li>
                <li className="mb-4"><Link to="/user/profile" className="hover:text-blue-400 transition">Profile</Link></li>
            </ul>
        </div>
    );
};

export default Sidebar;
