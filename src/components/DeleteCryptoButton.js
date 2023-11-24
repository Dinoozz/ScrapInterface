import React, { useState } from 'react';
import api from '../api/api';

const DeleteCryptoButton = ({ coinID, onResult }) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleDeleteCrypto = async () => {
        if (isLoading) return;

        setIsLoading(true);
        try {
            await api.deleteCrypto(coinID);
            onResult(true, `Crypto with coinID ${coinID} deleted successfully`);
        } catch (error) {
            onResult(false, error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button onClick={handleDeleteCrypto} disabled={isLoading}
            className="w-10 h-10 bg-red-600 rounded-md flex items-center justify-center focus:outline-none"
        >
            {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0116 0H4z"></path>
                </svg>
            ) : (
                // Ici, ajoutez votre icône de poubelle
                <span className="text-white text-2xl">🗑️</span>
            )}
        </button>
    );
};

export default DeleteCryptoButton;
