import React, { useEffect, useState } from 'react';
import api from '../api/api';

const StockErrorList = ({ onSelectError }) => {
  const [stockErrors, setStockErrors] = useState([]);
  

  useEffect(() => {
    fetchStockErrors();
  }, []);

  const fetchStockErrors = async () => {
    try {
      const response = await api.getAllStockError();
      setStockErrors(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des erreurs de stock:', error);
    }
  };

  const toggleErrorStatus = async (id, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      await api.updateStockErrorState(id, { statut: newStatus });
      fetchStockErrors(); // Recharger les erreurs après la mise à jour
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'erreur de stock:', error);
    }
  };

  const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);

  return (
    <div className="max-h-[calc(100vh-8rem)] overflow-y-auto">
      {stockErrors.map((error) => (
        <div
          key={error._id}
          className={`flex items-center m-2 p-3 rounded-lg border border-gray-300 cursor-pointer ${error.statut ? 'bg-green-200' : 'bg-red-200'}`}
          onClick={() => onSelectError(error._id)}
        >
          <p className="flex-grow">{capitalizeFirstLetter(error.origin)}</p>
          <button
            className="bg-blue-600 rounded p-1 text-white"
            onClick={() => toggleErrorStatus(error._id, error.statut)}
          >
            {error.statut ? '✕' : '✔'}
          </button>
        </div>
      ))}
    </div>
  );
};

export default StockErrorList;
