import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const RegistrarRostro = () => {
  const [empleadosSinRostro, setEmpleadosSinRostro] = useState([]);
  const [selectedEmpleado, setSelectedEmpleado] = useState('');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch employees without registered faces
    const fetchEmpleados = async () => {
      try {
        // This endpoint needs to be created in Django to return employees without faces
        const response = await axios.get('/api/empleados-sin-rostro/'); 
        setEmpleadosSinRostro(response.data);
      } catch (error) {
        console.error('Error fetching employees:', error);
        setMessage('Error al cargar empleados.');
      }
    };
    fetchEmpleados();

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
    };
  }, []);

  const captureAndSave = async () => {
    if (!selectedEmpleado) {
      setMessage('Por favor, selecciona un empleado.');
      return;
    }
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
      const response = await axios.post('/api/guardar-rostro/', { 
        empleado_id: selectedEmpleado, 
        image: imageData 
      });
      setMessage(response.data.message);
      // Optionally refresh the list of employees without faces
    } catch (error) {
      console.error('Error saving face:', error);
      setMessage('Error al guardar el rostro.');
    }
  };

  return (
    <div>
      <h2>Registrar Rostro</h2>
      {message && <p>{message}</p>}
      <div>
        <label htmlFor="empleado-select">Seleccionar Empleado:</label>
        <select 
          id="empleado-select"
          value={selectedEmpleado}
          onChange={(e) => setSelectedEmpleado(e.target.value)}
        >
          <option value="">-- Selecciona un empleado --</option>
          {empleadosSinRostro.map(empleado => (
            <option key={empleado.id} value={empleado.id}>
              {empleado.nombre} {empleado.apellido}
            </option>
          ))}
        </select>
      </div>
      <div style={{ margin: '20px 0' }}>
        <video ref={videoRef} autoPlay playsInline width="640" height="480"></video>
        <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
      </div>
      <button onClick={captureAndSave} disabled={!selectedEmpleado}>Capturar y Guardar Rostro</button>
    </div>
  );
};

export default RegistrarRostro;
