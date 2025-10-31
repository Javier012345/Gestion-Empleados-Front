import React, { useState } from 'react';
import { ArrowLeft, Search } from 'lucide-react';

const AgregarSancion = () => {
    const [dni, setDni] = useState('');
    const [empleado, setEmpleado] = useState(null);

    const handleSearch = (e) => {
        e.preventDefault();
        // Dummy data
        if (dni === '12345678') {
            setEmpleado({ nombre: 'Juan', apellido: 'Perez', dni: '12345678' });
        } else {
            setEmpleado(null);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <a href="/sanciones" className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500 mb-6">
                <ArrowLeft size={16} /> Volver al Historial de Sanciones
            </a>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Aplicar Sanción Directa</h2>

                <form onSubmit={handleSearch} className="mb-6">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">1. Buscar Empleado</h3>
                    <div className="flex gap-2">
                        <input 
                            name="dni" 
                            type="text" 
                            placeholder="DNI del empleado..." 
                            value={dni}
                            onChange={(e) => setDni(e.target.value)}
                            className="flex-grow w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
                        />
                        <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
                            <Search size={20} />
                        </button>
                    </div>
                </form>

                {empleado && (
                    <div className="mt-4 p-4 border rounded-lg bg-gray-50 dark:bg-gray-700/50 dark:border-gray-600">
                        <div className="flex items-center gap-4">
                            <div>
                                <p className="font-bold text-gray-900 dark:text-white">{empleado.nombre} {empleado.apellido}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{empleado.dni}</p>
                            </div>
                        </div>
                    </div>
                )}

                {empleado && (
                    <div className="mt-6">
                        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">2. Detalles de la Sanción</h3>
                        <form className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tipo de Sanción</label>
                                <select className="w-full mt-1 px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white">
                                    <option>Leve</option>
                                    <option>Moderada</option>
                                    <option>Grave</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Motivo</label>
                                <textarea rows="4" className="w-full mt-1 px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Fecha de Inicio</label>
                                <input type="date" className="w-full mt-1 px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Fecha de Fin</label>
                                <input type="date" className="w-full mt-1 px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white" />
                            </div>
                            <div className="mt-8 pt-4 border-t dark:border-gray-700 flex justify-end gap-3">
                                <a href="/sanciones" className="px-4 py-2 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">Cancelar</a>
                                <button type="submit" className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Guardar Sanción</button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AgregarSancion;