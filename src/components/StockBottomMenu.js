import React, { useState } from 'react';
import ManualSearchModal from './ManualSearchModal';
import { FaCamera, FaBarcode, FaSearch } from 'react-icons/fa';
import { MdCameraEnhance } from 'react-icons/md';

const BottomMenu = ({ userTeam, selectedWarehouse, products }) => {
    const [modalToShow, setModalToShow] = useState('');

    const openModal = (modalName) => {
        setModalToShow(modalName);
    };

    const closeModal = () => {
        setModalToShow('');
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 flex justify-around bg-white border-t border-gray-300 shadow-lg">
            <button className="w-1/4 h-16 flex flex-col items-center justify-center" onClick={() => openModal('modal1')}>
                <FaCamera className="text-2xl"/>
                <span className="text-xs mt-1">Caméra</span>
            </button>
            <button className="w-1/4 h-16 flex flex-col items-center justify-center" onClick={() => openModal('modal2')}>
                <MdCameraEnhance className="text-2xl"/>
                <span className="text-xs mt-1">Scan</span>
            </button>
            <button className="w-1/4 h-16 flex flex-col items-center justify-center" onClick={() => openModal('modal3')}>
                <FaBarcode className="text-2xl"/>
                <span className="text-xs mt-1">Code-barres</span>
            </button>
            <button className="w-1/4 h-16 flex flex-col items-center justify-center" onClick={() => openModal('modal4')}>
                <FaSearch className="text-2xl"/>
                <span className="text-xs mt-1">Recherche</span>
            </button>
            {/* Modale 1 */}
            {modalToShow === 'modal1' && (
                <ManualSearchModal onClose={closeModal} userTeam={userTeam} selectedWarehouse={selectedWarehouse} products={products} />
            )}
            {/* Modale 2 */}
            {modalToShow === 'modal2' && (
                <ManualSearchModal onClose={closeModal} userTeam={userTeam} selectedWarehouse={selectedWarehouse} products={products} />
                )}
            {/* Modale 3 */}
            {modalToShow === 'modal3' && (
                <ManualSearchModal onClose={closeModal} userTeam={userTeam} selectedWarehouse={selectedWarehouse} products={products} />
                )}
            {/* Modale 4 */}
            {modalToShow === 'modal4' && (
                <ManualSearchModal onClose={closeModal} userTeam={userTeam} selectedWarehouse={selectedWarehouse} products={products} />
                )}
        </div>
    );
};

export default BottomMenu;
