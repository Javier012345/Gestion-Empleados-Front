import React from 'react';

const RegistrarRostroTab = () => {
    // Dummy data for employees, replace with API call
    const empleados_sin_rostro = [
        { id: 1, nombre: 'Juan', apellido: 'Perez' },
        { id: 2, nombre: 'Maria', apellido: 'Gomez' },
    ];

    return (
        <div className="container">
            <h2 className="text-2xl font-bold mb-4">Registrar Rostro de Empleado</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <p className="text-gray-400">Seleccione un empleado y presione "Capturar Rostro" cuando esté listo.</p>
                    <div className="my-4">
                        <label htmlFor="empleadoSelect" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Empleado</label>
                        <select id="empleadoSelect" className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 shadow-sm dark:text-white">
                            <option value="">Seleccione un empleado...</option>
                            {empleados_sin_rostro.map(empleado => (
                                <option key={empleado.id} value={empleado.id}>{empleado.nombre} {empleado.apellido}</option>
                            ))}
                        </select>
                    </div>
                    <div className="camera-container border rounded bg-gray-900">
                        {/* Video element will be handled later */}
                        <div id="video-register" style={{width: '100%', height: 'auto', backgroundColor: 'black'}}></div>
                    </div>
                    <button id="captureBtn" className="mt-4 w-full bg-red-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-red-700">
                        <span>Capturar y Registrar Rostro</span>
                    </button>
                </div>
                <div className="flex flex-col items-center justify-center h-full">
                    <canvas id="canvas-register" style={{ display: 'none' }}></canvas>
                    <div id="result-register" className="text-center">
                        <p className="text-gray-500">La vista previa de la captura aparecerá aquí.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegistrarRostroTab;