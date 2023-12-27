import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../components/AuthContext';
import api from '../api/api';

const LoginRegister = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // État pour gérer les messages d'erreur
  const { logIn, isLoggedIn, assignUserRole } = useContext(AuthContext);

  useEffect(() => {
    if (isLoggedIn) {
      // Redirigez l'utilisateur vers la page d'accueil s'il est déjà connecté
      navigate('/');
    }
  }, [logIn]);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    if (error) setError(''); // Réinitialiser l'erreur lorsque l'utilisateur commence à taper
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    if (error) setError(''); // Réinitialiser l'erreur lorsque l'utilisateur commence à taper
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    const body = {
      email,
      password: password,
    };
    try {
      const response = await api.login(body);
      if (response.data && response.data.user.token) {
        localStorage.setItem("JWToken", response.data.user.token);
        logIn();
        assignUserRole(response.data.user.role);
        navigate('/');
      } else {
        setError("Connexion échouée"); // Message par défaut si pas de token
      }
    } catch (error) {
      // Afficher directement le message d'erreur en tant que texte
      setError(error ? error : "Erreur de connexion");
    }
  };

  // Définir le style des inputs en cas d'erreur
  const inputStyle = error ? "block w-full p-3 rounded bg-gray-200 border border-red-500 focus:outline-none" : "block w-full p-3 rounded bg-gray-200 border border-transparent focus:outline-none";

  return (
    <div className="container mx-auto p-8 flex max-h-screen overflow-hidden">
      <div className="max-w-md w-full mx-auto">
        <h1 className="text-4xl text-center mb-8 font-bold">Login</h1>

        <div className="bg-white rounded-lg overflow-hidden shadow-2xl">
          <div className="p-8">
            <form onSubmit={handleLogin}>
              <div className="mb-5">
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-600">Email</label>
                <input type="email" id="email" value={email} onChange={handleEmailChange} className={inputStyle} />
              </div>

              <div className="mb-6">
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-600">Password</label>
                <input type="password" id="password" value={password} onChange={handlePasswordChange} className={inputStyle} />
                {error && <p className="text-red-500 text-xs italic mt-2">{error}</p>} {/* Afficher le message d'erreur ici */}
              </div>

              <button type="submit" className="w-full p-3 mt-4 bg-indigo-600 text-white rounded shadow">Login</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginRegister;
