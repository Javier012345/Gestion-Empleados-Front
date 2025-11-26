import React, { useState, useEffect, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';
import { marcarAsistencia } from '../../services/api';

const STATUS_MESSAGES = {
    INITIAL: 'Cargando modelos de IA...',
    WAITING: 'Esperando rostro...',
    DETECTED: 'Rostro detectado, procesando...',
    ERROR: 'Error en el servidor. Por favor, contacte a soporte.',
};

const STATUS_TYPE = {
    NEUTRAL: 'bg-gray-700 text-gray-200',
    SUCCESS: 'bg-green-700 text-green-100',
    ERROR: 'bg-red-700 text-red-100',
};

const MarcarAsistenciaTab = () => {
    const [status, setStatus] = useState({
        message: STATUS_MESSAGES.INITIAL,
        type: STATUS_TYPE.NEUTRAL,
    });
    const [isProcessing, setIsProcessing] = useState(false);
    const webcamRef = useRef(null);
    const intervalRef = useRef(null);
    const canvasRef = useRef(null); // Añadimos una referencia para el canvas

    const handleDetection = useCallback(async () => {
        if (isProcessing || !webcamRef.current || !webcamRef.current.video || webcamRef.current.video.readyState !== 4) {
            return;
        }

        const video = webcamRef.current.video;
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions());

        if (detections.length > 0) {
            setIsProcessing(true);
            setStatus({ message: STATUS_MESSAGES.DETECTED, type: STATUS_TYPE.NEUTRAL });

            // --- NUEVO MÉTODO DE CAPTURA ---
            // Dibuja el frame actual del video en un canvas oculto y obtén la imagen desde ahí.
            const video = webcamRef.current.video;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext('2d').drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
            const imageSrc = canvas.toDataURL('image/jpeg');

            if (!imageSrc) {
                setIsProcessing(false);
                return;
            }

            // Log para depuración: Muestra la imagen en base64 en la consola del navegador.
            console.log("Enviando imagen al backend (primeros 100 caracteres):", imageSrc.substring(0, 100));
            console.log("Payload completo que se enviará:", JSON.stringify({ image: "data:image/jpeg;base64,..." }));

            try {
                const response = await marcarAsistencia(imageSrc);
                // Caso de éxito (201 Created)
                const { message } = response.data;
                setStatus({ message: message, type: STATUS_TYPE.SUCCESS });

            } catch (error) {
                console.error("Error en el reconocimiento:", error.response || error);
                
                if (error.response && error.response.data) {
                    // Manejo de errores de lógica de negocio (4xx)
                    const { message, empleado } = error.response.data;
                    let finalMessage = message;
                    if (empleado) {
                        finalMessage = `${empleado}: ${message}`;
                    }
                    setStatus({ message: finalMessage, type: STATUS_TYPE.ERROR });
                } else {
                    // Error genérico de servidor o red
                    setStatus({ message: STATUS_MESSAGES.ERROR, type: STATUS_TYPE.ERROR });
                }
            } finally {
                // Pausa antes de volver a intentar para dar feedback al usuario
                setTimeout(() => {
                    setIsProcessing(false);
                    setStatus({ message: STATUS_MESSAGES.WAITING, type: STATUS_TYPE.NEUTRAL });
                }, 5000); // Espera 5 segundos
            }
        }
    }, [isProcessing]);

    useEffect(() => {
        let isMounted = true;

        const loadModels = async () => {
            const MODEL_URL = '/models';
            try {
                await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
                if (isMounted) {
                    setStatus({ message: STATUS_MESSAGES.WAITING, type: STATUS_TYPE.NEUTRAL });
                    // Iniciar el sondeo inteligente SÓLO después de que los modelos se hayan cargado
                    intervalRef.current = setInterval(handleDetection, 2000); // Revisa cada 2 segundos
                }
            } catch (error) {
                console.error("Error al cargar los modelos de face-api:", error);
                if (isMounted) {
                    setStatus({ message: "Error al cargar modelos de IA.", type: STATUS_TYPE.ERROR });
                }
            }
        };
        loadModels();

        // Limpiar el intervalo cuando el componente se desmonte
        return () => {
            isMounted = false;
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [handleDetection]);

    return (
        <div className="container text-center">
            <div className="mx-auto" style={{ maxWidth: '700px' }}>
                <h2 className="text-2xl font-bold mb-4">Marcar Asistencia</h2>
                <p className="text-gray-400">Por favor, ubique su rostro frente a la cámara.</p>
                <div className="camera-container border rounded bg-gray-900 mx-auto mt-4 overflow-hidden" style={{ width: '100%', maxWidth: '500px' }}>
                    <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        screenshotQuality={0.8} // Calidad de imagen optimizada
                        mirrored={true}
                        className="w-full h-auto"
                    />
                    {/* Canvas oculto que usaremos para una captura de imagen más fiable */}
                    <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
                </div>
                <div id="status-mark" className="mt-3 text-lg">
                    <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full transition-colors duration-300 ${status.type}`}>
                        {status.message}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default MarcarAsistenciaTab;