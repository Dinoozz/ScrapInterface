import React, { createContext, useState, useEffect } from 'react';
import api from '../api/api';

export const AuthContext = createContext();

function timeout(delay) {
  return new Promise( res => setTimeout(res, delay) );
}

const LoadingPage = () => {
  const barStyle = {
    width: '2vw',
    height: '8vh',
    backgroundColor: '#a52a2a',
    marginRight: '1vw',
    animation: 'bounce 0.6s infinite ease-in-out',
    boxShadow: '0 0 8px rgba(0, 0, 0, 0.6)', // Ombre portée
    opacity: 0.9, // Légère transparence pour le fondu
    transition: 'opacity 0.3s', // Transition en douceur de l'opacité
  };

  const barAnimation = {
    '@keyframes bounce': {
      '0%, 100%': {
        transform: 'translateY(0)',
      },
      '50%': {
        transform: 'translateY(-2vh)',
      },
    },
  };

  // Ajouter l'animation dans une balise de style
  const animationStyle = `
    @keyframes bounce {
      0%, 100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-2vh);
      }
    }
  `;

  return (
    <div className="flex justify-center items-center h-screen" style={{
      backgroundImage: 'url("https://cuisinesetfourneaux.com/wp-content/uploads/2023/12/ldbg.jpeg")',
      backgroundSize: 'auto 100%',
      backgroundColor: '#808080',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      opacity: 0.8
    }}>
      <style>{animationStyle}</style>
      <div style={{ ...barStyle, animationDelay: '0s' }}></div>
      <div style={{ ...barStyle, animationDelay: '0.2s' }}></div>
      <div style={{ ...barStyle, marginRight: '0', animationDelay: '0.4s' }}></div>
    </div>
  );
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("JWToken");

    const fetchData = async () => {
      if (token) {

        try {
          // Essayez d'obtenir le rôle de l'utilisateur en utilisant le token
          const response = await api.getUserRole();
          if (response && response.data.role) {
            // Si la réponse indique un token valide, considérez l'utilisateur comme connecté
            setIsLoggedIn(true);
            setUserRole(response.data.role);
          }
        } catch (error) {
          // En cas d'erreur, cela signifie que le token est invalide, appelez la fonction logOut
          logOut();
        } finally {
          await timeout(1500);
          // Quelle que soit la réponse ou l'erreur, le chargement est terminé
          setLoading(false);
        }
      } else {
        await timeout(1500);
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

  const assignUserRole = (role) => {
    setUserRole(role);
  };

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, logIn, logOut, userRole, loading, assignUserRole }}>
      {children}
    </AuthContext.Provider>
  );
};
