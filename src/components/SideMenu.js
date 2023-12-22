import React, { useContext } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { AuthContext } from './AuthContext';



const Menu = () => {
    const jwtToken = localStorage.getItem('JWToken');
    const { isLoggedIn } = useContext(AuthContext);
  
    return (
        <div className="flex">
            <nav className="bg-gray-800 p-4 flex flex-col fixed h-full">
                <Link to="/admin/users" className="text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">User Manager</Link>
                <Link to="/admin/warehouse" className="text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">Stock Manager</Link>
                <Link to="/admin/stockerror" className="text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">Page 3</Link>
            </nav>
            <div className="content ml-[12vw] w-full mr-4">
                <Outlet />
            </div>
        </div>
    );
};
  
export default Menu;

  
