import React, { useState, useEffect } from 'react';

const ProductSelectionModal = ({ onClose, userTeam, selectedWarehouse, products }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        // Désactiver le défilement lors de l'ouverture de la modal
        document.body.style.overflow = 'hidden';
        return () => {
            // Réactiver le défilement lors de la fermeture de la modal
            document.body.style.overflow = 'unset';
        };
    }, []);

    const filteredProducts = products.filter(product => 
        product.reference.toLowerCase().includes(searchTerm.toLowerCase()) || 
        product.denomination.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleProductSelect = (product) => {
        setSelectedProduct(product);
    };

    const handleQuantityChange = (e) => {
        setQuantity(e.target.value);
    };

    const submitHandler = async () => {
        // Votre logique pour envoyer la requête API
        // Exemple: api.addProductToWarehouse({ teamId: userTeam, warehouseId: selectedWarehouse, productId: selectedProduct?._id, quantity });
        console.log('Submitting:', { teamId: userTeam, warehouseId: selectedWarehouse, productId: selectedProduct?._id, quantity });
        onClose(); // Ferme la modal après l'envoi
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
            <div className="bg-white p-4 rounded-lg">
                <h3 className="text-lg font-bold mb-4">Sélectionnez un produit</h3>
                <input 
                    type="text" 
                    placeholder="Recherche..." 
                    className="border p-2 w-full mb-4"
                    onChange={(e) => setSearchTerm(e.target.value)} 
                />
                <table className="min-w-full table-auto">
                    <thead>
                        <tr>
                            <th className="border px-4 py-2">Dénomination</th>
                            <th className="border px-4 py-2">Référence</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.slice(0, 5).map((product, idx) => (
                            <tr 
                                key={idx}
                                className={`border ${selectedProduct?._id === product._id ? 'bg-blue-200' : 'bg-white'}`}
                                onClick={() => handleProductSelect(product)}
                            >
                                <td className="border px-4 py-2">{product.denomination}</td>
                                <td className="border px-4 py-2">{product.reference}</td>
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
