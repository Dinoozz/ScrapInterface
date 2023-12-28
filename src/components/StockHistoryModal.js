import React, { useState, useEffect } from 'react';
import api from '../api/api';

const StockHistoryModal = ({ onClose, userTeam, userWarehouse }) => {
    const [stockHistory, setStockHistory] = useState([]);

    useEffect(() => {
        fetchStockHistory();
    }, []);

    useEffect(() => {
        // Désactiver le défilement lors de l'ouverture de la modal
        document.body.style.overflow = 'hidden';
        return () => {
            // Réactiver le défilement lors de la fermeture de la modal
            document.body.style.overflow = 'unset';
        };
    }, []);

    const fetchStockHistory = async () => {
        try {
            const response = await api.getAllStockHistoryByTeamByWarehouse(userTeam, userWarehouse);
            console.log(response);
            // Inverser l'ordre pour afficher les plus récents en premier
            setStockHistory(response.data.reverse());
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'historique des stocks:', error);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${day}/${month} ${hours}:${minutes}`;
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center pt-10">
            <div className="bg-white p-4 rounded-lg w-full max-w-2xl">
                <h3 className="text-lg font-bold mb-4">Historique des Stocks</h3>
                <div className="overflow-x-auto max-h-[40vh] overflow-y-auto">
                <table className="min-w-full text-sm text-left text-gray-500 w-full table-auto">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 w-2/5">Dénomination</th> {/* 40% */}
                            <th className="px-6 py-3 w-3/10">Réf.</th> {/* 30% */}
                            <th className="px-6 py-3 w-1/10">Quantité</th> {/* 10% */}
                            <th className="px-6 py-3 w-1/5">Date</th> {/* 20% */}
                        </tr>
                    </thead>
                    <tbody>
                        {stockHistory.map((history, index) => (
                            <tr key={index} className="bg-white border-b">
                                <td className="px-6 py-3 w-2/5">{history.IDProduct.denomination}</td>
                                <td className="px-6 py-3 w-3/10">{history.IDProduct.reference}</td>
                                <td className="px-6 py-3 w-1/10">{history.quantity}</td>
                                <td className="px-6 py-3 w-1/5">{formatDate(history.date)}</td>
                            </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
                <div className="flex justify-end mt-4">
                    <button 
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        onClick={onClose}
                    >
                        Fermer
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StockHistoryModal;
