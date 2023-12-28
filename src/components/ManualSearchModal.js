import React, { useState, useEffect } from 'react';
import api from '../api/api';

const ProductSelectionModal = ({ onClose, userTeam, selectedWarehouse, products, onProductAdded }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [responseState, setResponseState] = useState('null');

    useEffect(() => {
        // Désactiver le défilement lors de l'ouverture de la modal
        document.body.style.overflow = 'hidden';
        return () => {
            // Réactiver le défilement lors de la fermeture de la modal
            document.body.style.overflow = 'unset';
        };
    }, []);

    const filteredProducts = products.filter(product => {
        const searchWords = searchTerm.trim().split(/\s+/); // Diviser la chaîne de recherche en mots
        return searchWords.every(word => 
            product.reference.toLowerCase().includes(word.toLowerCase()) || 
            product.denomination.toLowerCase().includes(word.toLowerCase())
        );
    });

    const handleProductSelect = (product) => {
        setSelectedProduct(product);
    };

    const handleQuantityChange = (e) => {
        setQuantity(e.target.value);
    };

    const submitHandler = async () => {
        if (!selectedProduct || !quantity) {
            setResponseState('error');
            setTimeout(() => {
                setResponseState(null);
            }, 1000);
        } else if (window.confirm("Êtes-vous sûr de vouloir ajouter ce produit ?")) {
            // Votre logique pour envoyer la requête API
            const response = await api.updateStockProduct(selectedProduct?._id, {
                teamId: userTeam,
                warehouseId: selectedWarehouse,
                quantity: quantity
            });
            if (response.status == 200) {
                setResponseState('success');
            } else
                setResponseState('error');
            console.log();
                
            
            setTimeout(() => {
                setResponseState(null);
                if (response.data.updatedStockProduct._id === selectedProduct?._id) {
                    onProductAdded();
                }
            }, 1000);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center mt-10 px-2">
            <div className={`bg-white p-4 rounded-lg ${responseState === 'success' ? 'border-y-8 border-green-400' : responseState === 'error' ? 'border-y-8 border-red-400' : ''}`}>
                <h3 className="text-lg font-bold mb-4">Sélectionnez un produit</h3>
                <input 
                    type="text" 
                    placeholder="Recherche..." 
                    className="border p-2 w-full mb-4"
                    onChange={(e) => setSearchTerm(e.target.value)} 
                />
                <table className="w-full table-auto ">
                    <thead>
                        <tr>
                            <th style={{ width: '60%' }} className="border px-4 py-2">Dénomination</th>
                            <th style={{ width: '40%' }} className="border px-4 py-2">Référence</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.slice(0, 5).map((product, idx) => (
                            <tr 
                                key={idx}
                                className={`border ${selectedProduct?._id === product._id ? 'bg-blue-200' : 'bg-white'}`}
                                onClick={() => handleProductSelect(product)}
                            >
                                <td style={{ width: '60%' }}className="border px-4 py-2 overflow-auto">
                                    <div className="h-10">{product.denomination}</div>
                                </td>
                                <td style={{ width: '40%' }} className="border px-4 py-2 overflow-auto">
                                    <div className="h-10">{product.reference}</div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="mt-4 flex items-center">
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

export default ProductSelectionModal;
