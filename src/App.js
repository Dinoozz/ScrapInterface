import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Menu from './components/Menu'; // Importez le composant Menu
import { AuthProvider } from './components/AuthContext';
import HomePage from './page/HomePage'; // Importez vos autres composants de page
import LoginPage from './page/LoginPage';
import ProfilePage from './page/ProfilePage';
import SideMenu from './components/SideMenu';
import UserManagerPage from './page/UserManagerPage';
import WarehousePage from './page/WarehousePage';
import InventoryPage from './page/InventoryPage';
import StockErrorPage from './page/StockErrorPage';
// Importez d'autres pages selon vos besoins

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className='mt-16'>
          <Menu />
          <Routes>
          <Route path="/" element={<InventoryPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/admin" element={<SideMenu />}>
            <Route path="users" element ={<UserManagerPage />}/>
            <Route path="stockerror" element ={<StockErrorPage />}/>
            <Route path="warehouse" element ={<WarehousePage />}/>
          </Route>
          {/*<Route path="/inventory" element={<InventoryPage />} />*/}
          // Ajoutez d'autres routes si nécessaire

            {/* Définissez d'autres routes selon vos besoins */}
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
