import React, { useState } from 'react';
import ManualSearchModal from './ManualSearchModal';
import StockProductCreation from './StockProductCreationModal';
import StockOCRModal from './StockOCRModal';
import { FaCamera, FaSearch, FaPlus } from 'react-icons/fa';

const BottomMenu = ({ userTeam, selectedWarehouse, products, onProductAdded }) => {
    const [modalToShow, setModalToShow] = useState('');

    const openModal = (modalName) => {
        setModalToShow(modalName);
    };

    const closeModal = () => {
        setModalToShow('');
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 flex justify-around bg-white border-t border-gray-300 shadow-lg">
            <button className="w-1/3 h-16 flex flex-col items-center justify-center" onClick={() => openModal('modal1')}>
                <FaPlus className="text-2xl"/>
                <span className="text-xs mt-1">Ajouter</span>
            </button>
            <button className="w-1/3 h-16 flex flex-col items-center justify-center" onClick={() => openModal('modal2')}>
                <FaCamera className="text-2xl"/>
                <span className="text-xs mt-1">Caméra</span>
            </button>
            <button className="w-1/3 h-16 flex flex-col items-center justify-center" onClick={() => openModal('modal3')}>
                <FaSearch className="text-2xl"/>
                <span className="text-xs mt-1">Recherche</span>
            </button>
            {/* Modale pour "Ajouter" */}
            {modalToShow === 'modal1' && (
                <StockProductCreation onClose={closeModal} userTeam={userTeam} selectedWarehouse={selectedWarehouse} onProductAdded={onProductAdded}/>
            )}
            {/* Modale pour "Caméra" */}
            {modalToShow === 'modal2' && (
                <StockOCRModal onClose={closeModal} userTeam={userTeam} selectedWarehouse={selectedWarehouse} products={products} onProductAdded={onProductAdded}/>
            )}
            {/* Modale pour "Recherche" */}
            {modalToShow === 'modal3' && (
                <ManualSearchModal onClose={closeModal} userTeam={userTeam} selectedWarehouse={selectedWarehouse} products={products} onProductAdded={onProductAdded}/>
            )}
        </div>
    );
};

export default BottomMenu;
