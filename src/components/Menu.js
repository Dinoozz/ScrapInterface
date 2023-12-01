import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import logo from '../assets/logo.png';
import profile from '../assets/profile.png';
/*

<Link to="/page1" className="text-white px-3 py-2 rounded-md text-sm font-medium">Page 1</Link>
<Link to="/page2" className="text-white px-3 py-2 rounded-md text-sm font-medium">Page 2</Link>
<Link to="/page3" className="text-white px-3 py-2 rounded-md text-sm font-medium">Page 3</Link>
<Link to="/page4" className="text-white px-3 py-2 rounded-md text-sm font-medium">Admin Dashboard</Link>
*/

const Menu = () => {
  const jwtToken = localStorage.getItem('JWToken');
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <nav className="flex justify-between items-center fixed top-0 left-0 right-0 z-10 bg-gray-800 p-4">
      <div className="flex items-center">
        
        <Link to="/"><img src={logo} alt="Logo" className="h-12 w-12 mr-2" /></Link>
    {isLoggedIn && <Link to="/admin" className="text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">Admin Dashboard</Link>}
      </div>
      <div className="flex items-center">
        {!isLoggedIn && <Link to="/login" className="text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">Se connecter</Link>}
        <Link to="/profile" className="ml-4 flex items-center justify-center bg-gray-700 text-white rounded-full h-10 w-10 hover:bg-gray-500">
            <img src={profile} alt="Profile" className="p-1 h-full w-full" />
        </Link>
      </div>
    </nav>
  );
};

export default Menu;
