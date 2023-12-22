import React, { useState, useRef, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import Webcam from 'react-webcam';
import Tesseract from 'tesseract.js';
import api from '../api/api';

const OCRModal = ({ onClose, userTeam, selectedWarehouse }) => {
    const webcamRef = useRef(null);
    const overlayCanvasRef = useRef(null);
    const [text, setText] = useState('');
    const [devices, setDevices] = useState([]);
    const [currentDeviceId, setCurrentDeviceId] = useState(null);
    const [showCamera, setShowCamera] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        navigator.mediaDevices.enumerateDevices().then(devices => {
            const videoDevices = devices.filter(device => device.kind === 'videoinput');
            setDevices(videoDevices);
            if (videoDevices.length > 0) {
                setCurrentDeviceId(videoDevices[0].deviceId);
            }
        });
    }, []);

    useEffect(() => {
        if (showCamera) {
            const intervalId = setInterval(() => {
                if (!isProcessing) {
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
        setIsProcessing(true);
    };

    const processText = (text) => {
        const words = text.split(/\s+/);
        const uniqueWords = Array.from(new Set(words)); 

        uniqueWords.forEach(word => {
            if (word.trim().length > 0) {
                // Envoyer chaque mot via une requête API
                const requestData = {
                    reference: word.trim(),
                    warehouse: selectedWarehouse,
                    team: userTeam,
                };
                api.searchStockProduct(requestData).then(response => {
                    // Traiter la réponse ici
                    console.log(response);
                    if (response.message === "Produit trouvé")
                        onClose();
                }).catch(error => {
                    console.error('Error:', error);
                });
            }
        });

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

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center mt-10 px-2">
            <div className="bg-white rounded-lg w-full max-w-lg p-4 relative ">
                <button onClick={onClose} className="relative mb-2 mr-4 bg-red-500 text-white py-2 px-4 rounded flex items-center ">
                    <FaTimes className="mr-2" /> Fermer
                </button>
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
                {devices.length > 0 && (
                    <button onClick={toggleCamera} className="bg-blue-500 text-white py-2 px-4 mt-2 rounded">
                        Changer de Caméra
                    </button>
                )}
                <div className="w-full border border-black p-4 mt-4" style={{ minHeight: '50px' }}>
                    {text || <span className="text-gray-500">Aucun texte détecté</span>}
                </div>
            </div>
        </div>
    );
    
};

export default OCRModal;
