import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { AuthContext } from '../components/AuthContext'; // Assurez-vous que le chemin est correct
import { FaUser, FaUsers, FaBriefcase, FaEnvelope, FaLock } from 'react-icons/fa'; // Ensure react-icons is installed


const ProfilePage = () => {
    const navigate = useNavigate();
    const { logOut } = useContext(AuthContext);
    const [userInfo, setUserInfo] = useState({
        username: '',
        email: '',
        role: ''
    });
    const [userTeamName, setUserTeamName] = useState('');

    useEffect(() => {
        fetchUserInfo();
        fetchUserTeam();
    }, []);

    const fetchUserInfo = async () => {
        try {
            const response = await api.getUserInfo();
            setUserInfo({
                username: response.username,
                email: response.email,
                role: response.role
            });
        } catch (error) {
            console.error('Erreur lors de la récupération des informations de l\'utilisateur:', error);
        }
    };

    const fetchUserTeam = async () => {
        try {
            const teamResponse = await api.getUserTeam();
            const teamId = teamResponse.team;
            if (teamId) {
                const teamInfo = await api.getTeamById(teamId);
                setUserTeamName(teamInfo.name);
            }
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'équipe de l\'utilisateur:', error);
        }
    };

    const handleLogout = async () => {
        try {
            await api.logout();
            logOut();
            localStorage.clear();
            document.cookie.split(";").forEach((c) => {
                document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
            });
            navigate('/');
        } catch (error) {
            console.error('Erreur lors de la déconnexion:', error);
        }
    };

    return (
      <div className="container mx-auto p-4 pt-8 bg-white shadow rounded-lg max-w-md">
          <div className="flex flex-col items-center pb-10">
              <div className="mb-4 bg-blue-600 w-full py-10 flex items-center justify-center rounded-t-lg">
                  <FaUser className="text-white h-16 w-16" />
              </div>
              <h1 className="text-2xl font-semibold text-gray-800">{userInfo.username}</h1>
              <div className="w-full flex flex-col p-4">
                  <div className="flex items-center border-b py-2">
                      <FaUser className="text-gray-400 mr-2" />
                      <span className="flex-grow">{userInfo.username}</span>
                  </div>
                  <div className="flex items-center border-b py-2">
                      <FaUsers className="text-gray-400 mr-2" />
                      <span className="flex-grow">Équipe : {userTeamName}</span>
                  </div>
                  <div className="flex items-center border-b py-2">
                      <FaBriefcase className="text-gray-400 mr-2" />
                      <span className="flex-grow">Rôle : {userInfo.role}</span>
                  </div>
                  <div className="flex items-center border-b py-2">
                      <FaEnvelope className="text-gray-400 mr-2" />
                      <span className="flex-grow">{userInfo.email}</span>
                  </div>
                  <div className="flex items-center border-b py-2">
                      <FaLock className="text-gray-400 mr-2" />
                      <span className="flex-grow">Password</span>
                  </div>
              </div>
              <button
                  onClick={handleLogout}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
              >
                  Déconnexion
              </button>
              <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full mt-4"
              >
                  Edit Profile
              </button>
          </div>
      </div>
  );
};

export default ProfilePage;
