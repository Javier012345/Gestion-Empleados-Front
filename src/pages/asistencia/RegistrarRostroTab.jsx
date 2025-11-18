import React, { useState, useEffect, useRef } from 'react';
import Webcam from 'react-webcam';
import { getEmpleadosSinRostro, registrarRostro } from '../../services/api'; // Asegúrate que la ruta a tu archivo api.js es correcta

const RegistrarRostroTab = () => {
    const [empleadosSinRostro, setEmpleadosSinRostro] = useState([]);
    const [selectedEmpleado, setSelectedEmpleado] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [capturedImage, setCapturedImage] = useState(null);
    const webcamRef = useRef(null);

    // Efecto para cargar los empleados sin rostro al montar el componente
    useEffect(() => {
        const fetchEmpleados = async () => {
            try {
                setLoading(true);
                setError('');
                const response = await getEmpleadosSinRostro();
                setEmpleadosSinRostro(response.data);
            } catch (err) {
                setError('Error al cargar la lista de empleados. Por favor, intente de nuevo.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchEmpleados();
    }, []);

    const handleCaptureAndRegister = async () => {
        if (!selectedEmpleado) {
            setError('Por favor, seleccione un empleado.');
            return;
        }

        const imageSrc = webcamRef.current.getScreenshot();
        if (!imageSrc) {
            setError('No se pudo capturar la imagen. Verifique los permisos de la cámara.');
            return;
        }

        setCapturedImage(imageSrc); // Muestra la vista previa
        setError('');
        setSuccessMessage('');

        try {
            await registrarRostro(parseInt(selectedEmpleado, 10), imageSrc);
            setSuccessMessage('Rostro registrado exitosamente.');
            // Opcional: Refrescar la lista de empleados o quitar el empleado registrado
            setEmpleadosSinRostro(prev => prev.filter(emp => emp.id !== parseInt(selectedEmpleado, 10)));
            setSelectedEmpleado('');
            setCapturedImage(null);

        } catch (err) {
            setError('Error al registrar el rostro. Intente de nuevo.');
            console.error(err);
        }
    };

    return (
        <div className="container">
            <h2 className="text-2xl font-bold mb-4">Registrar Rostro de Empleado</h2>
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}
            {successMessage && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">{successMessage}</div>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <p className="text-gray-400">Seleccione un empleado y presione "Capturar Rostro" cuando esté listo.</p>
                    <div className="my-4">
                        <label htmlFor="empleadoSelect" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Empleado</label>
                        <select
                            id="empleadoSelect"
                            value={selectedEmpleado}
                            onChange={(e) => setSelectedEmpleado(e.target.value)}
                            disabled={loading}
                            className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 shadow-sm dark:text-white disabled:bg-gray-500"
                        >
                            <option value="">Seleccione un empleado...</option>
                            {loading ? <option>Cargando...</option> : empleadosSinRostro.map(empleado => (
                                <option key={empleado.id} value={empleado.id}>{empleado.nombre} {empleado.apellido}</option>
                            ))}
                        </select>
                    </div>
                    <div className="camera-container border rounded bg-gray-900 overflow-hidden">
                        <Webcam
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            mirrored={true}
                            screenshotMirrored={false}
                            className="w-full h-auto"
                        />
                    </div>
                    <button onClick={handleCaptureAndRegister} disabled={!selectedEmpleado} className="mt-4 w-full bg-red-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-red-700 disabled:bg-red-400">
                        <span>Capturar y Registrar Rostro</span>
                    </button>
                </div>
                <div className="flex flex-col items-center justify-center h-full">
                    <div id="result-register" className="text-center">
                        {capturedImage ? (
                            <img src={capturedImage} alt="Captura de rostro" className="rounded-lg border-4 border-blue-500" />
                        ) : (
                            <p className="text-gray-500">La vista previa de la captura aparecerá aquí.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegistrarRostroTab;