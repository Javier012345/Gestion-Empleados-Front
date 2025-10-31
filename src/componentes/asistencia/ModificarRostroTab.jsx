import React from 'react';

const ModificarRostroTab = () => {
    // Dummy data for employees, replace with API call
    const empleados_con_rostro = [
        { id: 3, nombre: 'Carlos', apellido: 'Rodriguez' },
        { id: 4, nombre: 'Ana', apellido: 'Martinez' },
    ];

    return (
        <div className="container">
            <h2 className="text-2xl font-bold mb-4">Modificar Rostro de Empleado</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <p className="text-gray-400">Seleccione un empleado para volver a capturar su rostro. El registro anterior será reemplazado.</p>
                    <div className="my-4">
                        <label htmlFor="empleadoSelect-modify" className="block text-sm font-medium text-gray-300">Empleado con Rostro Registrado</label>
                        <select id="empleadoSelect-modify" className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 shadow-sm text-white">
                            <option value="">Seleccione un empleado...</option>
                            {empleados_con_rostro.map(empleado => (
                                <option key={empleado.id} value={empleado.id}>{empleado.nombre} {empleado.apellido}</option>
                            ))}
                        </select>
                    </div>
                    <div className="camera-container border rounded bg-gray-900">
                        {/* Video element will be handled later */}
                        <div id="video-modify" style={{width: '100%', height: 'auto', backgroundColor: 'black'}}></div>
                    </div>
                    <button id="captureBtn-modify" className="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700">
                        <span>Capturar y Modificar Rostro</span>
                    </button>
                </div>
                <div className="flex flex-col items-center justify-center h-full">
                    <canvas id="canvas-modify" style={{ display: 'none' }}></canvas>
                    <div id="result-modify" className="text-center">
                        <p className="text-gray-500">La vista previa de la captura aparecerá aquí.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModificarRostroTab;