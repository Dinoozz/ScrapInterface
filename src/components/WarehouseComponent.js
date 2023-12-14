import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { FaTrash, FaPlus, FaPencilAlt, FaCheck, FaTimes, FaMinus } from 'react-icons/fa';

const WarehouseManagerComponent = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newWarehouseName, setNewWarehouseName] = useState('');
  const [editingWarehouse, setEditingWarehouse] = useState(null);
  const [editingWarehouseName, setEditingWarehouseName] = useState('');

  useEffect(() => {
    fetchWarehouses();
    fetchTeams();
  }, []);

  const fetchWarehouses = async () => {
    try {
      const response = await api.getAllWarehouse();
      setWarehouses(response);
    } catch (error) {
      console.error('Erreur lors de la récupération des entrepôts:', error);
    }
  };

  const fetchTeams = async () => {
    try {
      const response = await api.getAllTeams();
      setTeams(response);
    } catch (error) {
      console.error('Erreur lors de la récupération des équipes:', error);
    }
  };

  const handleWarehouseSelect = (warehouse) => {
    setSelectedWarehouse(warehouse);
    setEditingWarehouse(null);
  };

  const createWarehouse = async () => {
    if (newWarehouseName) {
      try {
        await api.addWarehouse({ name: newWarehouseName });
        fetchWarehouses();
        setShowModal(false);
        setNewWarehouseName('');
      } catch (error) {
        console.error('Erreur lors de la création de l\'entrepôt:', error);
      }
    }
  };

  const deleteWarehouse = async (warehouseId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      try {
        await api.deleteWarehouse(warehouseId);
        fetchWarehouses();
        if (selectedWarehouse && selectedWarehouse._id === warehouseId) {
          setSelectedWarehouse(null);
        }
      } catch (error) {
        console.error('Erreur lors de la suppression de l\'entrepôt:', error);
      }
    }
  };

  const startEditingWarehouse = (warehouse) => {
    setEditingWarehouse(warehouse);
    setEditingWarehouseName(warehouse.name);
  };

  const cancelEditingWarehouse = () => {
    setEditingWarehouse(null);
    setEditingWarehouseName('');
  };

  const saveEditingWarehouse = async () => {
    if (editingWarehouse && editingWarehouseName) {
      try {
        await api.updateWarehouse(editingWarehouse._id, { name: editingWarehouseName });
        setEditingWarehouse(null);
        setEditingWarehouseName('');
        fetchWarehouses();
        if (selectedWarehouse && selectedWarehouse._id === editingWarehouse._id) {
          handleWarehouseSelect(editingWarehouse); // Refresh selected warehouse
        }
      } catch (error) {
        console.error("Erreur lors de la mise à jour de l'entrepôt:", error);
      }
    }
  };

  const addTeamToWarehouse = async (teamId) => {
    if (selectedWarehouse) {
      try {
        await api.addTeamToWarehouse(selectedWarehouse._id, teamId);
        refreshSelectedWarehouse(selectedWarehouse._id);
      } catch (error) {
        console.error("Erreur lors de l'ajout de l'équipe à l'entrepôt:", error);
      }
    }
  };
  
  const deleteTeamFromWarehouse = async (teamId) => {
    if (selectedWarehouse) {
      try {
        await api.deleteTeamToWarehouse(selectedWarehouse._id, teamId);
        refreshSelectedWarehouse(selectedWarehouse._id);
      } catch (error) {
        console.error("Erreur lors de la suppression de l'équipe de l'entrepôt:", error);
      }
    }
  };
  
  const refreshSelectedWarehouse = async (warehouseId) => {
    try {
      const updatedWarehouse = await api.getWarehouseById(warehouseId);
      setSelectedWarehouse(updatedWarehouse);
      fetchWarehouses(); // Optionally refresh the entire warehouses list
    } catch (error) {
      console.error("Erreur lors de la récupération de l'entrepôt:", error);
    }
  };

  const isTeamInSelectedWarehouse = (teamId) => {
    return selectedWarehouse?.listAssignedTeam?.some((team) => team._id === teamId);
  };
  

  const filteredTeams = teams.filter((team) => !isTeamInSelectedWarehouse(team._id));

  return (
    <div className="flex">
      <div className="w-1/4 overflow-auto h-[calc(50vh)]">
        <h2 className="text-xl font-bold mb-2 sticky top-0 bg-gray-200 p-2">Entrepôts</h2>
        <button onClick={() => setShowModal(true)} className="w-full text-left mb-2 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded">
          Créer un entrepôt
        </button>
        {warehouses.map((warehouse) => (
          <div key={warehouse._id} className="flex items-center mb-2">
            {editingWarehouse && editingWarehouse._id === warehouse._id ? (
              <>
                <input
                  type="text"
                  value={editingWarehouseName}
                  onChange={(e) => setEditingWarehouseName(e.target.value)}
                  className="flex-grow p-2 rounded"
                />
                <button onClick={saveEditingWarehouse} className="text-green-600 hover:text-green-900 bg-white p-2 rounded-full mx-1">
                  <FaCheck />
                </button>
                <button onClick={cancelEditingWarehouse} className="bg-white p-2 rounded-full mx-1 text-red-600 hover:text-red-900">
                  <FaTimes />
                </button>
              </>
            ) : (
              <>
                <button onClick={() => handleWarehouseSelect(warehouse)} className={`flex-grow text-left ${selectedWarehouse && selectedWarehouse._id === warehouse._id ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-300 hover:bg-blue-300'} text-white py-2 px-4 rounded`}>
                  {warehouse.name}
                </button>
                <button onClick={() => startEditingWarehouse(warehouse)} className="text-indigo-600 hover:text-indigo-900 bg-white p-2 rounded-full mx-1">
                  <FaPencilAlt />
                </button>
                <button onClick={() => deleteWarehouse(warehouse._id)} className="text-red-600 hover:text-red-900 bg-white p-2 rounded-full">
                  <FaTrash />
                </button>
              </>
            )}
          </div>
        ))}
      </div>

      <div className="w-3/4 pl-4">
        {selectedWarehouse ? (
          <>
            <div className="w-full overflow-auto h-[calc(50vh-12rem)]">
              <h2 className="text-xl font-bold mb-2 sticky top-0 bg-gray-200 p-2">Équipes Assignées</h2>
              <div className="flex flex-wrap">
                {selectedWarehouse.listAssignedTeam.map((team) => (
                  <div key={team._id} className="flex items-center bg-red-100 hover:bg-red-200 mb-1 mr-1 p-2 rounded-full border border-gray-300 cursor-pointer" onClick={() => deleteTeamFromWarehouse(team._id)}>
                    <span className="mr-2 pl-1">{team.name}</span>
                    <FaMinus className="text-red-500" />
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full mt-4 overflow-auto h-[calc(50vh-12rem)]">
              <h2 className="text-xl font-bold mb-2 sticky top-0 bg-gray-200 p-2">Ajouter une Équipe</h2>
              <div className="flex flex-wrap">
                {filteredTeams.map((team) => (
                  <div key={team._id} className="flex items-center bg-green-100 hover:bg-green-200 mb-1 mr-1 p-2 rounded-full border border-gray-300 cursor-pointer" onClick={() => addTeamToWarehouse(team._id)}>
                    <span className="mr-2 pl-1">{team.name}</span>
                    <FaPlus className="text-blue-500" />
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center my-10">
            <p>Veuillez sélectionner ou créer un entrepôt.</p>
          </div>
        )}
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-1/4 mx-auto p-5 border w-11/12 md:max-w-md lg:max-w-lg shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Créer un nouvel entrepôt</h3>
              <div className="mt-2 px-7 py-3">
                <input
                  type="text"
                  className="border-2 pl-1 border-white-100 w-full py-2 px-4"
                  placeholder="Nom de l'entrepôt"
                  value={newWarehouseName}
                  onChange={(e) => setNewWarehouseName(e.target.value)}
                />
                <button
                  onClick={createWarehouse}
                  className="mt-4 mr-2 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                  Valider
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="mt-4 ml-2 py-2 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WarehouseManagerComponent;

