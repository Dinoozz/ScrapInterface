//warehouse : "657ac30ae14cb0b0a253d048",
//team : "657ac302e14cb0b0a253d035",

import React, { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import Tesseract from 'tesseract.js';
import api from '../api/api';

const OCRPage = () => {
    const webcamRef = useRef(null);
    const overlayCanvasRef = useRef(null);
    const [text, setText] = useState('');
    const [devices, setDevices] = useState([]);
    const [currentDeviceId, setCurrentDeviceId] = useState(null);
    const [showCamera, setShowCamera] = useState(false);
    const [foundProducts, setFoundProducts] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false); // Nouvel état pour contrôler le processus

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
                if (!isProcessing) { // Vérifie si le processus n'est pas déjà en cours
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
        const uniqueWords = Array.from(new Set(words)); // Supprime les doublons

        if (uniqueWords.length > 0 && uniqueWords[0] !== '') {
            uniqueWords.forEach(word => {
                if (word.trim().length > 0) {
                    const stockProduct = {
                        reference: word.trim(),
                        warehouse : "6579d126edbe492f95139e65",
                        team : "6579d11bedbe492f95139e4b",
                    };
                    api.searchStockProduct(stockProduct).then(response => {
                        if (response.message === "Produit trouvé") {
                            console.log("Produit trouvé: " + word);
                            setFoundProducts(prevProducts => [...prevProducts, ...response.products]);
                            setShowCamera(false); // Désactiver la caméra si un produit est trouvé
                        }
                        setIsProcessing(false); // Fin du traitement
                    }).catch(error => {
                        console.error('Error searching product:', error);
                        setIsProcessing(false); // Fin du traitement en cas d'erreur
                    });
                }
            });
        } else {
            setIsProcessing(false); // Aucun mot valide, fin du traitement
        }
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
        <div>
            <button onClick={() => setShowCamera(!showCamera)} className="mb-4 bg-blue-500 text-white py-2 px-4 rounded">
                {showCamera ? 'Arrêter la Caméra' : 'Démarrer la Caméra'}
            </button>
            {showCamera && (
                <div style={{ position: 'relative', width: '640px', height: '480px' }}>
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
                        style={{ position: 'absolute', top: 0, left: 0 }}
                    />
                    <canvas
                        ref={overlayCanvasRef}
                        style={{ position: 'absolute', top: 0, left: 0 }}
                    />
                    {devices.length > 0 && (
                        <button onClick={toggleCamera} style={{ position: 'absolute', right: '10px', bottom: '10px', zIndex: 1 }}>
                            Changer de Caméra
                        </button>
                    )}
                    <div style={{ position: 'absolute', bottom: 0, left: 0, color: 'white', backgroundColor: 'rgba(0, 0, 0, 0.5)', padding: '10px' }}>
                        {text}
                    </div>
                </div>
            )}
            <div className="mt-4">
                {foundProducts.map(product => (
                    <div key={product._id} className="inline-block bg-gray-200 text-black m-2 p-2 rounded-full">
                        {product.reference}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OCRPage;
