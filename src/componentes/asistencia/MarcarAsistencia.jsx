import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const MarcarAsistencia = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [message, setMessage] = useState('');
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    // Access webcam
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        videoRef.current.srcObject = stream;
        setStream(stream);
      })
      .catch(err => {
        console.error('Error accessing webcam:', err);
        setMessage('No se pudo acceder a la cámara. Asegúrate de dar permisos.');
      });

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []);

  const startRecognition = () => {
    if (intervalId) {
      clearInterval(intervalId);
    }
    const id = setInterval(captureAndRecognize, 3000); // Capture every 3 seconds
    setIntervalId(id);
    setMessage('Iniciando reconocimiento...');
  };

  const stopRecognition = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
      setMessage('Reconocimiento detenido.');
    }
  };

  const captureAndRecognize = async () => {
    if (!videoRef.current || !canvasRef.current) {
      setMessage('Cámara no disponible.');
      return;
    }

    const context = canvasRef.current.getContext('2d');
    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
    const imageData = canvasRef.current.toDataURL('image/jpeg');

    try {
      const response = await axios.post('/api/reconocer-rostro/', { image: imageData });
      if (response.data.status === 'success') {
        setMessage(`Asistencia marcada para ${response.data.nombre}`);
        stopRecognition(); // Stop after successful recognition
      } else if (response.data.status === 'already_marked') {
        setMessage(`${response.data.nombre} ya ha marcado asistencia hoy.`);
        stopRecognition();
      } else if (response.data.status === 'not_found') {
        setMessage('Rostro no reconocido. Inténtalo de nuevo.');
      } else {
        setMessage(`Error: ${response.data.message}`);
      }
    } catch (error) {
      console.error('Error recognizing face:', error);
      setMessage('Error al intentar reconocer el rostro.');
    }
  };

  return (
    <div>
      <h2>Marcar Asistencia</h2>
      {message && <p>{message}</p>}
      <div style={{ margin: '20px 0' }}>
        <video ref={videoRef} autoPlay playsInline width="640" height="480"></video>
        <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
      </div>
      <button onClick={startRecognition} disabled={!stream || intervalId}>Iniciar Reconocimiento</button>
      <button onClick={stopRecognition} disabled={!intervalId}>Detener Reconocimiento</button>
    </div>
  );
};

export default MarcarAsistencia;
