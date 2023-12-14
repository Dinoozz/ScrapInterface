import React from 'react';
import WarehouseComponent from '../components/WarehouseComponent';

const UserManager = () => {
  // Exemple: Si le menu a une hauteur de 64px (16rem avec la base par défaut de 4)
  return (
    <div className="overflow-hidden mt-6" style={{ height: `calc(100vh - 8rem)` }}>
        <WarehouseComponent />
    </div>
  );
};

export default UserManager;
