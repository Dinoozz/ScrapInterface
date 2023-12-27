import React, { useEffect, useState } from 'react';
import { FaPencilAlt, FaCheck, FaTimes, FaTimesCircle } from 'react-icons/fa';
import api from '../api/api';

const ErrorDetails = ({ errorId, onStatusChange }) => {
  const [errorDetails, setErrorDetails] = useState(null);
  const [editableProducts, setEditableProducts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (errorId) {
      fetchErrorDetails(errorId);
    }
  }, [errorId]);

  const fetchErrorDetails = async (id) => {
    try {
      const response = await api.getStockErrorById(id);
      const errorData = response.data;

      // Enrichir chaque produit avec des données supplémentaires
      for (const product of errorData.listProduct) {
        const teamResponse = await api.getTeamById(product.assignedTeam);
        const warehouseResponse = await api.getWarehouseById(product.warehouse);
        product.teamName = teamResponse.data.name;
        product.warehouseName = warehouseResponse.data.name;
      }

      setErrorDetails(errorData);
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors de la récupération des détails de l\'erreur:', error);
      setLoading(false);
    }
  };

  const toggleErrorStatus = async () => {
    if (errorDetails) {
      const newStatus = !errorDetails.statut;
      try {
        await api.updateStockErrorState(errorId, { statut: newStatus });
        fetchErrorDetails(errorId); // Recharger les détails après la mise à jour
        onStatusChange();
      } catch (error) {
        console.error('Erreur lors de la mise à jour du statut de l\'erreur:', error);
      }
    }
  };

  const toggleEditMode = () => {
    if (!isEditing) {
      // Copiez les produits dans un état modifiable
      setEditableProducts(errorDetails.listProduct.map(p => ({ ...p })));
    }
    setIsEditing(!isEditing);
  };

  const handleQuantityChange = (index, newValue) => {
    const updatedProducts = [...editableProducts];
    updatedProducts[index].quantity = newValue;
    setEditableProducts(updatedProducts);
  };

  const handleCancelEdit = () => {
    // Annuler les modifications et quitter le mode d'édition
    setEditableProducts([]);
    setIsEditing(false);
  };

  const handleSubmitEdit = async () => {
    try {
      // Mettre à jour chaque produit modifié
      for (const product of editableProducts) {
        await api.correctionStockProduct(product._id, {
          teamId: product.assignedTeam,
          warehouseId: product.warehouse,
          quantity: product.quantity
        });
      }
      // Recharger les détails et quitter le mode d'édition
      fetchErrorDetails(errorId);
      setIsEditing(false);
    } catch (error) {
      console.error('Erreur lors de la mise à jour des produits:', error);
    }
  };

  if (loading) {
    return <p>Chargement des détails...</p>;
  }

  if (!errorDetails) {
    return <p>Aucun détail trouvé pour cette erreur.</p>;
  }

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Détails de l'Erreur</h2>
      <p className="mb-2">ID de l'Erreur: <span className="font-medium">{errorDetails._id}</span></p>
      <p className="mb-2">Statut: <span className="font-medium">{errorDetails.statut ? 'True' : 'False'}</span></p>
      <p className="mb-4">Origine: <span className="font-medium">{errorDetails.origin}</span></p>
      <div className="flex justify-between">
        <button onClick={toggleErrorStatus} className={`py-2 px-4 rounded ${errorDetails?.statut ? 'bg-green-600 hover:bg-green-500' : 'bg-red-600 hover:bg-red-500'}`}>
          Statut: {errorDetails?.statut ? 'Fermer' : 'Ouvert'}
        </button>
        {!isEditing ? (
          <button onClick={toggleEditMode} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center">
            <FaPencilAlt className="mr-2" /> Corriger
          </button>
        ) : (
          <div className="flex">
            <button onClick={handleSubmitEdit} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center mr-2">
              <FaCheck className="mr-2" /> Valider
            </button>
            <button onClick={handleCancelEdit} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex items-center">
              <FaTimes className="mr-2" /> Annuler
            </button>
          </div>
        )}
      </div>
      <h3 className="text-lg font-semibold mb-3">Produits concernés :</h3>
      <div className="overflow-x-auto max-h-[calc(100vh-24rem)] overflow-y-auto">
        <table className="min-w-full text-sm text-left text-gray-500 w-full table-auto table-fixed">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" style={{ width: '30%' }} className="px-6 py-3">Dénomination</th>
              <th scope="col" style={{ width: '20%' }} className="px-6 py-3">Référence</th>
              <th scope="col" style={{ width: '10%' }} className="px-6 py-3">Entrepôt</th>
              <th scope="col" style={{ width: '10%' }} className="px-6 py-3">Équipe</th>
              <th scope="col" style={{ width: '10%' }} className="px-6 py-3">Quantité</th>
            </tr>
          </thead>
          <tbody>
            {isEditing ? editableProducts.map((product, index) => (
              <tr key={index} className="bg-white border-b">
                <td style={{ width: '30%' }} className="px-6 py-4">{product.denomination}</td>
                <td style={{ width: '20%' }} className="px-6 py-4">{product.reference}</td>
                <td style={{ width: '10%' }} className="px-6 py-4">{product.warehouseName}</td>
                <td style={{ width: '10%' }} className="px-6 py-4">{product.teamName}</td>
                <td style={{ width: '10%' }} className="px-6 py-4">
                  <input 
                    type="number" 
                    className="border p-2 w-14"
                    value={product.quantity}
                    onChange={e => handleQuantityChange(index, e.target.value)}
                    min="1"
                  />
                </td>
              </tr>
            )) : errorDetails.listProduct.map((product, index) => (
              <tr key={index} className="bg-white border-b">
                <td style={{ width: '30%' }} className="px-6 py-4">{product.denomination}</td>
                <td style={{ width: '20%' }} className="px-6 py-4">{product.reference}</td>
                <td style={{ width: '10%' }} className="px-6 py-4">{product.warehouseName}</td>
                <td style={{ width: '10%' }} className="px-6 py-4">{product.teamName}</td>
                <td style={{ width: '10%' }} className="px-6 py-4">{product.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ErrorDetails;
