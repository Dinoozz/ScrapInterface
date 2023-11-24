import React, { createContext, useState, useEffect } from 'react';
import api from '../api/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("JWToken");

    const fetchData = async () => {
      if (token) {
        console.log("salam");

        try {
          // Essayez d'obtenir le rôle de l'utilisateur en utilisant le token
          const response = await api.getUserRole();

          console.log(response.message);

          // Si la réponse indique un token valide, considérez l'utilisateur comme connecté
          setIsLoggedIn(true);
          setUserRole(response.role);
        } catch (error) {
          // En cas d'erreur, cela signifie que le token est invalide, appelez la fonction logOut
          logOut();
        } finally {
          // Quelle que soit la réponse ou l'erreur, le chargement est terminé
          setLoading(false);
        }
      } else {
        // Si aucun JWT n'est présent dans le local storage, le chargement est terminé
        setLoading(false);
      }
    };

    fetchData(); // Appelez la fonction asynchrone ici pour qu'elle s'exécute au chargement du composant
  }, []);

  const logIn = () => {
    setIsLoggedIn(true);
  };

  const logOut = () => {
    // Appelez la fonction logOut pour déconnecter l'utilisateur
    setIsLoggedIn(false);
    setUserRole(null);
    localStorage.removeItem("JWToken");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, logIn, logOut, userRole, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
