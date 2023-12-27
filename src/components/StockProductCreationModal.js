import React, { useState, useEffect } from 'react';
import api from '../api/api';

const ProductCreationModal = ({ onClose, userTeam, selectedWarehouse, onProductAdded }) => {
    const [denomination, setDenomination] = useState('');
    const [reference, setReference] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [responseState, setResponseState] = useState('null');

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const handleDenominationChange = (e) => {
        setDenomination(e.target.value);
    };

    const handleReferenceChange = (e) => {
        const upperCaseReference = e.target.value.toUpperCase().replace(/\s+/g, ''); // Convertir en majuscules et supprimer les espaces
        setReference(upperCaseReference);
    };
    

    const handleQuantityChange = (e) => {
        setQuantity(e.target.value);
    };

    const submitHandler = async () => {
        if (!denomination || !reference || !quantity) {
            setResponseState('error');
            setTimeout(() => {
                setResponseState(null);
            }, 1000);
        } else if (window.confirm("Êtes-vous sûr de vouloir ajouter ce produit ?")) {
            // Votre logique pour envoyer la requête API
            const response = await api.addStockProduct({
                reference: reference.replace(/\s+/g, ''),
                denomination,
                teamId: userTeam,
                warehouseId: selectedWarehouse,
                quantity: quantity
            });
            if (response.status == 201) {
                setResponseState('success');
            } else
                setResponseState('error');
                
                
            setTimeout(() => {
                setResponseState(null);
                console.log(response.data.userStockProduct.reference);
                console.log(reference);
                if (response.data.userStockProduct.reference === reference.replace(/\s+/g, '')) {
                    onProductAdded();
                    onClose(); // Ferme la modal après l'envoi
                }
            }, 1000);
        }
    };

    return (
        <div className="px-2 fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center pt-10">
            <div className={`bg-white p-4 rounded-lg ${responseState === 'success' ? 'border-y-8 border-green-400' : responseState === 'error' ? 'border-y-8 border-red-400' : ''}`}>
                <h3 className="text-lg font-bold mb-4">Ajouter un produit</h3>
                <input 
                    type="text" 
                    placeholder="Dénomination" 
                    className="border p-2 w-full mb-4"
                    value={denomination}
                    onChange={handleDenominationChange} 
                />
                <input 
                    type="text" 
                    placeholder="Référence" 
                    className="border p-2 w-full mb-4"
                    value={reference}
                    onChange={handleReferenceChange} 
                />
                <div className="flex items-center">
                    <label className="mr-2">Quantité :</label>
                    <input 
                        type="number" 
                        className="border p-2"
                        value={quantity}
                        onChange={handleQuantityChange}
                        min="1"
                    />
                </div>
                <div className="flex justify-end mt-4">
                    <button 
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={submitHandler}
                    >
                        Ajouter
                    </button>
                    <button 
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded ml-2"
                        onClick={onClose}
                    >
                        Annuler
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCreationModal;
