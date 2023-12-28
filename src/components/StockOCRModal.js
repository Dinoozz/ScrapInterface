import React, { useState, useRef, useEffect } from 'react';
import { FaTimes, FaCheck, FaBan, FaTimesCircle } from 'react-icons/fa';
import Webcam from 'react-webcam';
import Tesseract from 'tesseract.js';
import api from '../api/api';

const OCRModal = ({ onClose, userTeam, selectedWarehouse, onProductAdded }) => {
    const webcamRef = useRef(null);
    const overlayCanvasRef = useRef(null);
    const [text, setText] = useState('');
    const [devices, setDevices] = useState([]);
    const [currentDeviceId, setCurrentDeviceId] = useState(null);
    const [showCamera, setShowCamera] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [foundProduct, setFoundProduct] = useState(null);
    const [isProductFound, setIsProductFound] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [responseState, setResponseState] = useState('null');



    useEffect(() => {
        navigator.mediaDevices.enumerateDevices().then(devices => {
            const videoDevices = devices.filter(device => device.kind === 'videoinput');
            setDevices(videoDevices);
            if (videoDevices.length > 0) {
                setCurrentDeviceId(videoDevices[videoDevices.length - 1].deviceId);
            }
        });
    }, []);

    useEffect(() => {
        
        if (showCamera) {
            const intervalId = setInterval(() => {
                const webcam = webcamRef.current;
                if (!isProcessing && webcam && webcam.video.readyState === 4) {
                    capture();
                }
            }, 500); // Capture toutes les 0.5 secondes
            drawOverlay();
            return () => clearInterval(intervalId);
        }
    }, [showCamera, currentDeviceId, isProcessing]);

    // Dessiner les zones grises sur le canvas
    const drawOverlay = () => {
        const canvas = overlayCanvasRef.current;
        const webcam = webcamRef.current;
        if (canvas && webcam && webcam.video.readyState === 4) {
            const context = canvas.getContext('2d');
            const { videoWidth: width, videoHeight: height } = webcam.video;
            canvas.width = width;
            canvas.height = height;

            // Appliquer un filtre gris sur toute l'image
            context.fillStyle = 'rgba(0, 0, 0, 0.5)';
            context.fillRect(0, 0, width, height);

            // Effacer la zone centrale pour la laisser en couleur normale
            const centerX = width * 0;
            const centerY = height * 0.40;
            const regionWidth = width * 1;
            const regionHeight = height * 0.2;
            context.clearRect(centerX, centerY, regionWidth, regionHeight);
        }
    };

    // Fonction pour capturer l'image et reconnaître le texte avec Tesseract
    const capture = () => {
        const webcam = webcamRef.current;
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (webcam && webcam.video.readyState === 4) {
            setIsProcessing(true);
            const { videoWidth: width, videoHeight: height } = webcam.video;
    
            // Définir la zone à capturer (bande blanche au centre)
            const centerX = width * 0;
            const centerY = height * 0.40;
            const regionWidth = width * 1;
            const regionHeight = height * 0.2;
    
            canvas.width = regionWidth;
            canvas.height = regionHeight;
    
            // Dessiner seulement la zone centrale sur le canvas
            context.drawImage(webcam.video, centerX, centerY, regionWidth, regionHeight, 0, 0, regionWidth, regionHeight);
    
            // Convertir cette zone en Data URL pour Tesseract
            const dataUrl = canvas.toDataURL('image/jpeg');

            // Envoyer la Data URL à Tesseract pour la reconnaissance de texte
            Tesseract.recognize(
                dataUrl,
                'fra+eng'
            ).then(({ data: { text } }) => {
                setText(text);
                processText(text);
            }).catch(e => {
                console.error('Error during Tesseract recognition:', e);
            });
        }
    };

    const processText = async (text) => {
        const words = text.split(/\s+/);
        const uniqueWords = Array.from(new Set(words));
    
        for (const word of uniqueWords) {
            if (word.trim().length > 0) {
                // Envoyer chaque mot via une requête API
                const requestData = {
                    reference: word.trim().toUpperCase(),
                    warehouse: selectedWarehouse,
                    team: userTeam,
                };
                try {
                    const response = await api.searchStockProduct(requestData);
                    console.log(response.data.product);
                    if (response.data.message === "Produit trouvé") {
                        setFoundProduct(response.data.product);
                        setIsProductFound(true);
                        setIsProcessing(false);
                        break;
                    }
                } catch (error) {
                    console.error('Error:', error);
                }
            }
        }
        setIsProcessing(false); // Fin du traitement
    };

    const toggleCamera = () => {
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        if (videoDevices.length > 1) {
            let newIndex = videoDevices.findIndex(device => device.deviceId === currentDeviceId) + 1;
            if (newIndex >= videoDevices.length) newIndex = 0;
            setCurrentDeviceId(videoDevices[newIndex].deviceId);
        }
    };

    // Définissez les fonctions qui géreront les clics sur les boutons
    const handleValidate = async () => {
        if (!quantity) {
            setResponseState('error');
            setTimeout(() => {
                setResponseState(null);
            }, 1000);
        } else if (window.confirm("Êtes-vous sûr de vouloir ajouter ce produit ?")) {
            // Votre logique pour envoyer la requête API
            const response = await api.updateStockProduct(foundProduct?._id, {
                teamId: userTeam,
                warehouseId: selectedWarehouse,
                quantity: quantity
            });
            if (response.status == 200) {
                setResponseState('success');
            } else
                setResponseState('error');
            setTimeout(() => {
                setResponseState(null);
                if (response.data.updatedStockProduct._id === foundProduct?._id) {
                    onProductAdded();
                    onClose(); // Ferme la modal après l'envoi
                }
            }, 1000);
        }
    };

    const handleCancel = () => {
        setFoundProduct(null);  // Réinitialiser le produit trouvé
        setQuantity(1);
        setIsProductFound(false); // Indiquer qu'aucun produit n'est actuellement trouvé
        // Vous pouvez ici relancer la capture si nécessaire
    };

    const handleQuantityChange = (e) => {
        setQuantity(e.target.value);
    };
    
    
    return  (
        <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center mt-10 px-2">
            <div className={`bg-white rounded-lg w-full max-w-lg p-4 relative ${responseState === 'success' ? 'border-y-8 border-green-400' : responseState === 'error' ? 'border-y-8 border-red-400' : ''}`}>
                {isProductFound ? (
                    <>
                        <h3 className="text-lg font-bold mb-4">Produit trouvé</h3>
                        <div className="border p-4">
                            <p><strong>Dénomination:</strong> {foundProduct.denomination}</p>
                            <p><strong>Référence:</strong> {foundProduct.reference}</p>
                            <div className="mt-4 flex items-center">
                                <label className="mr-2"><strong>Quantité :</strong></label>
                                <input 
                                    type="number" 
                                    className="border p-2 w-32"
                                    value={quantity}
                                    onChange={handleQuantityChange}
                                    min="1"
                                />
                            </div>
                        </div>
                        <div className="mt-4 flex justify-center space-x-2">
                            <button onClick={handleValidate} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center">
                                <FaCheck className="mr-2" /> Valider
                            </button>
                            <button onClick={handleCancel} className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded flex items-center">
                                <FaBan className="mr-2" /> Annuler
                            </button>
                            <button onClick={onClose} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex items-center">
                                <FaTimesCircle className="mr-2" /> Fermer
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        {showCamera && (
                            <div className="relative w-full h-64"> {/* Hauteur fixe pour la zone de la caméra */}
                                <Webcam
                                    audio={false}
                                    ref={webcamRef}
                                    screenshotFormat="image/jpeg"
                                    videoConstraints={{
                                        width: 640,
                                        height: 480,
                                        deviceId: currentDeviceId ? { exact: currentDeviceId } : undefined
                                    }}
                                    onLoadedMetadata={drawOverlay}
                                    className="w-full h-full"
                                />
                                <canvas
                                    ref={overlayCanvasRef}
                                    className="absolute top-0 left-0 w-full h-full"
                                />
                            </div>
                        )}
                        <div className="w-full border border-black p-4 mt-4" style={{ minHeight: '50px' }}>
                            {text || <span className="text-gray-500">Aucun texte détecté</span>}
                        </div>
                        <div className="flex justify-between mt-4">
                            {devices.length > 0 && (
                                <button onClick={toggleCamera} className="bg-blue-500 text-white py-2 px-4 rounded">
                                    Changer de Caméra
                                </button>
                            )}
                            <button onClick={onClose} className="text-white bg-red-500 py-2 px-4 rounded flex items-center">
                                <FaTimesCircle className="mr-2" /> Fermer
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
    

export default OCRModal;
