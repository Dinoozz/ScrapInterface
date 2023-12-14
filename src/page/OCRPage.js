import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import Tesseract from 'tesseract.js';
import api from '../api/api'

const OCRPage = () => {
    const navigate = useNavigate();
    const webcamRef = useRef(null);
    const overlayCanvasRef = useRef(null);
    const [text, setText] = useState('');
    const [devices, setDevices] = useState([]);
    const [currentDeviceId, setCurrentDeviceId] = useState(null);

    // Enumérer les dispositifs de médias disponibles
    useEffect(() => {
        navigator.mediaDevices.enumerateDevices().then(devices => {
            const videoDevices = devices.filter(device => device.kind === 'videoinput');
            setDevices(videoDevices);
            if (videoDevices.length > 0) {
                setCurrentDeviceId(videoDevices[0].deviceId);
            }
        });
    }, []);

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
                'fra+eng',
                { }
            ).then(({ data: { text } }) => {
                setText(text);
                processText(text);
            }).catch(e => {
                console.error('Error during Tesseract recognition:', e);
            });
        }
    };

    const processText = (text) => {
        const words = text.split(/\s+/);
        if (words.length > 0 && words[0] !== '') {
            words.forEach(word => {
                if (word.trim().length > 0) {
                    const stockProduct = {
                        reference: word.trim(),
                        warehouse : "6579d126edbe492f95139e65",
                        team : "6579d11bedbe492f95139e4b",
                    };
                    api.searchStockProduct(stockProduct).then(response => {
                        if (response.message === "Produit trouvé") {
                            navigate('/');
                        }
                    }).catch(error => {
                        console.error('Error searching product:', error);
                    });
                }
            });
        }
    };

    // Définir un intervalle pour capturer et reconnaître le texte régulièrement
    useEffect(() => {
        const intervalId = setInterval(() => {
            capture();
        }, 500); // Capture toutes les 0.5 secondes
        drawOverlay();
        return () => clearInterval(intervalId);
    }, [currentDeviceId]);

    // Fonction pour changer de caméra
    const toggleCamera = () => {
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        if (videoDevices.length > 1) {
            let newIndex = videoDevices.findIndex(device => device.deviceId === currentDeviceId) + 1;
            if (newIndex >= videoDevices.length) newIndex = 0;
            setCurrentDeviceId(videoDevices[newIndex].deviceId);
        }
    };

    return (
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
    );
};

export default OCRPage;
