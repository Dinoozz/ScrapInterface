import React, { useState, useEffect } from 'react';
import api from '../api/api'; // Assurez-vous que le chemin est correct
import Modal from '../components/NewUserModal'
import { FaTrash, FaPencilAlt, FaTimes, FaCheck, FaPlus } from 'react-icons/fa'; // Assurez-vous d'installer react-icons

const UserManager = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ username: '', email: '', password: '', role: 'user' });
  const [editingIndex, setEditingIndex] = useState(-1); // -1 signifie qu'aucun utilisateur n'est en cours d'édition
  const [showModal, setShowModal] = useState(false);
  const [roles] = useState(['user', 'manager', 'admin']);


  useEffect(() => {
    getAllUsers();
  }, []);

  const handleInputChange = (event, index) => {
    const { name, value } = event.target;
    const updatedUsers = [...users];
    updatedUsers[index] = { ...updatedUsers[index], [name]: value };
    setUsers(updatedUsers);
  };

  const handleNewUserChange = (event) => {
    const { name, value } = event.target;
    setNewUser({ ...newUser, [name]: value });
  };
  
  

  const getAllUsers = async () => {
    try {
      const response = await api.getAllUsers();
      console.log(response);
      setUsers(response);
    } catch (error) {
      console.error('Erreur lors de la récupération de tous les utilisateurs:', error);
    }
  };

  const createUser = async () => {
    try {
      await api.register(newUser);
      setNewUser({ username: '', email: '', password: '' });
      await getAllUsers();
    } catch (error) {
      console.error('Erreur lors de la création de l\'utilisateur:', error);
    }
  };

  const updateUser = async (userId, user) => {
    try {
      console.log(user);
      await api.updateUser(userId, user);
      await getAllUsers();
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
    }
  };

  const deleteUser = async (userId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      try {
        await api.deleteUser(userId);
        await getAllUsers();
      } catch (error) {
        console.error('Erreur lors de la suppression de l\'utilisateur:', error);
      }
    }
  };

  return (
    <>
      <div class="relative h-28 w-full">
        <button onClick={() => setShowModal(true)} className="rounded-full bg-green-500 p-4 m-4 z-10 mt-8 absolute top-0 right-0 ">
          <span className="text-white flex flex-row items-center"><FaPlus className='mr-2'/> Nouvel Utilisateur</span>
        </button>
      </div>  
      
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <form onSubmit={(e) => { e.preventDefault(); createUser(); setShowModal(false);}} className="space-y-4">
          <div>
            <input className="border-2 pl-1 border-white-100" type="text" name="username" value={newUser.username} onChange={handleNewUserChange} placeholder="Nom d'utilisateur"/>
          </div>
          <div>
            <input className="border-2 pl-1 border-white-100" type="email" name="email" value={newUser.email} onChange={handleNewUserChange} placeholder="Email"/>
          </div>
          <div>
            <input className="border-2 pl-1 border-white-100" type="password" name="password" value={newUser.password} onChange={handleNewUserChange} placeholder="Password"/>
          </div>
            <div className="whitespace-nowrap flex flex-col items-center pt-4">
              <button type="submit" className="w-max py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex items-center justify-center">Créer</button>
            </div>
          </form>
        </Modal>
      )}
  
    <div className="overflow-x-auto w-full">
        <table className="min-w-full table-fixed">
          <thead>
            <tr className='bg-gray-100'>
              <th className="w-1/5 px-4 py-2">Username</th>
              <th className="w-1/5 px-4 py-2">Email</th>
              <th className="w-1/5 px-4 py-2">Password</th>
              <th className="w-1/5 px-4 py-2">Role</th>
              <th className="w-1/5 px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user._id} className={`border-b ${editingIndex === index ? 'bg-gray-100 shadow-outline' : 'hover:bg-gray-50'}`}>
                <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">
                  {editingIndex === index ? (
                    <input type="text" value={user.username} name="username" onChange={(e) => handleInputChange(e, index)} className="form-input rounded-md shadow-sm mt-1 block w-full" />
                  ) : (
                    <span className="block w-full">{user.username}</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">
                  {editingIndex === index ? (
                    <input type="email" value={user.email} name="email" onChange={(e) => handleInputChange(e, index)} className="form-input rounded-md shadow-sm mt-1 block w-full" />
                  ) : (
                    <span className="block w-full">{user.email}</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">
                  {editingIndex === index ? (
                    <input type="password" name="password" placeholder="New Password" onChange={(e) => handleInputChange(e, index)} className="form-input rounded-md shadow-sm mt-1 block w-full" />
                  ) : (
                    <span className="block w-full">••••••••</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">
                  {editingIndex === index ? (
                    <select name="role" value={user.role} onChange={(e) => handleInputChange(e, index)} className="form-select rounded-md shadow-sm mt-1 block w-full">
                      {roles.map(role => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                  ) : (
                    <span className="block w-full">{user.role}</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-no-wrap text-right text-sm leading-5 font-medium">
                  <div className="flex justify-center items-center">
                    {editingIndex === index ? (
                      <>
                        <button onClick={() => setEditingIndex(-1)} className="text-red-600 hover:text-red-900">
                          <FaTimes />
                        </button>
                        <button onClick={() => {
                          updateUser(user._id, users[index]);
                          setEditingIndex(-1);
                        }} className="text-green-600 hover:text-green-900 ml-3">
                          <FaCheck />
                        </button>
                      </>
                    ) : (
                      <button onClick={() => setEditingIndex(index)} className="text-indigo-600 hover:text-indigo-900">
                        <FaPencilAlt />
                      </button>
                    )}
                    <button onClick={() => deleteUser(user._id)} className="text-red-600 hover:text-red-900 ml-3">
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default UserManager;