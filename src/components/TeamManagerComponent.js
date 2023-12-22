import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { FaTrash, FaPlus, FaMinus, FaPencilAlt, FaCheck, FaTimes } from 'react-icons/fa';

const TeamManagerComponent = ({ onUserAssignedToTeam }) => {
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [editingTeam, setEditingTeam] = useState(null);
  const [editingTeamName, setEditingTeamName] = useState('');

  useEffect(() => {
    fetchTeams();
    fetchUsers();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await api.getAllTeams();
      setTeams(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des équipes:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.getAllUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
    }
  };

  const handleTeamSelect = (team) => {
    setSelectedTeam(team);
    setEditingTeam(null);
  };

  const refreshTeam = async (teamId) => {
    try {
      const updatedTeam = await api.getTeamById(teamId);
      setSelectedTeam(updatedTeam.data);
      fetchTeams();
    } catch (error) {
      console.error('Erreur lors de la récupération des détails de l\'équipe:', error);
    }
  };

  const addUserToTeam = async (userId) => {
    if (selectedTeam) {
      try {
        await api.updateUser(userId, { team: selectedTeam.name });
        refreshTeam(selectedTeam._id);
        fetchUsers();
        onUserAssignedToTeam();
      } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'utilisateur à l\'équipe:', error);
      }
    }
  };

  const removeUserFromTeam = async (userId) => {
    try {
      await api.updateUser(userId, { team: 'Aucune' });
      refreshTeam(selectedTeam._id);
      fetchUsers();
      onUserAssignedToTeam();
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'utilisateur de l\'équipe:', error);
    }
  };

  const createTeam = async () => {
    if (newTeamName) {
      try {
        await api.addTeam({ name: newTeamName });
        fetchTeams();
        setShowModal(false);
        setNewTeamName('');
      } catch (error) {
        console.error('Erreur lors de la création de l\'équipe:', error);
      }
    }
  };

  const deleteTeam = async (teamId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      try {
        await api.deleteTeam(teamId);
        fetchTeams();
        if (selectedTeam && selectedTeam._id === teamId) {
          setSelectedTeam(null);
        }
      } catch (error) {
        console.error('Erreur lors de la suppression de l\'équipe:', error);
      }
    }
  };

  const startEditingTeam = (team) => {
    setEditingTeam(team);
    setEditingTeamName(team.name);
  };

  const cancelEditingTeam = () => {
    setEditingTeam(null);
    setEditingTeamName('');
  };

  const saveEditingTeam = async () => {
    if (editingTeam && editingTeamName) {
      try {
        await api.updateTeam(editingTeam._id, { name: editingTeamName });
        setEditingTeam(null);
        setEditingTeamName('');
        fetchTeams();
        if (selectedTeam && selectedTeam._id === editingTeam._id) {
          refreshTeam(editingTeam._id);
        }
      } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'équipe:', error);
      }
    }
  };

  const isUserInSelectedTeam = (userId) => {
    return selectedTeam?.listUser.some((user) => user._id === userId);
  };

  const filteredUsers = users.filter((user) => !isUserInSelectedTeam(user._id));

  return (
    <div className="flex">
      <div className="w-1/4 overflow-auto h-[calc(50vh-2rem)]">
        <h2 className="text-xl font-bold mb-2 sticky top-0 bg-gray-200 p-2">Équipes</h2>
        <button onClick={() => setShowModal(true)} className="w-full text-left mb-2 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded">
          Créer une équipe
        </button>
        {teams.map((team) => (
          <div key={team._id} className="flex items-center mb-2">
            {editingTeam && editingTeam._id === team._id ? (
              <>
                <input
                  type="text"
                  value={editingTeamName}
                  onChange={(e) => setEditingTeamName(e.target.value)}
                  className="flex-grow p-2 rounded"
                />
                <button onClick={saveEditingTeam} className="text-green-600 hover:text-green-900 bg-white p-2 rounded-full mx-1">
                  <FaCheck />
                </button>
                <button onClick={cancelEditingTeam} className="bg-white p-2 rounded-full mx-1 text-red-600 hover:text-red-900">
                  <FaTimes />
                </button>
              </>
            ) : (
              <>
                <button onClick={() => handleTeamSelect(team)} className={`flex-grow text-left ${selectedTeam && selectedTeam._id === team._id ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-300 hover:bg-blue-300'} text-white py-2 px-4 rounded`}>
                  {team.name}
                </button>
                <button onClick={() => startEditingTeam(team)} className="text-indigo-600 hover:text-indigo-900 bg-white p-2 rounded-full mx-1">
                  <FaPencilAlt />
                </button>
                <button onClick={() => deleteTeam(team._id)} className="text-red-600 hover:text-red-900 bg-white p-2 rounded-full">
                  <FaTrash />
                </button>
              </>
            )}
          </div>
        ))}
      </div>
  
      <div className="w-3/4 pl-4">
        {selectedTeam ? (
          <>
            <div className="w-full overflow-auto h-[calc(50vh-13rem)]">
              <h2 className="text-xl font-bold mb-2 sticky top-0 bg-gray-200 p-2">Membres de l'équipe</h2>
              <div className="flex flex-wrap">
                {selectedTeam.listUser.map((user) => (
                  <div key={user._id} className="flex items-center bg-red-100 hover:bg-red-200 mb-1 mr-1 p-2 rounded-full border border-gray-300 cursor-pointer" onClick={() => removeUserFromTeam(user._id)}>
                    <span className="mr-2 pl-1">{user.username}</span>
                    <FaMinus className="text-red-500" />
                  </div>
                ))}
              </div>
            </div>
  
            <div className="w-full mt-4 overflow-auto h-[calc(50vh-12rem)]">
              <h2 className="text-xl font-bold mb-2 sticky top-0 bg-gray-200 p-2">Ajouter un utilisateur</h2>
              <div className="flex flex-wrap">
                {filteredUsers.map((user) => (
                  <div key={user._id} className="flex items-center bg-green-100 hover:bg-green-200 mb-1 mr-1 p-2 rounded-full border border-gray-300 cursor-pointer" onClick={() => addUserToTeam(user._id)}>
                    <span className="mr-2 pl-1">{user.username}</span>
                    <FaPlus className="text-blue-500" />
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center my-10">
            <p>Veuillez sélectionner ou créer une équipe.</p>
          </div>
        )}
      </div>
  
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-1/4 mx-auto p-5 border w-11/12 md:max-w-md lg:max-w-lg shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Créer une nouvelle équipe</h3>
              <div className="mt-2 px-7 py-3">
                <input
                  type="text"
                  className="border-2 pl-1 border-white-100 w-full py-2 px-4"
                  placeholder="Nom de l'équipe"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                />
                <button
                  onClick={createTeam}
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

export default TeamManagerComponent;
