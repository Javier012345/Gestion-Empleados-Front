import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useParams, Link } from 'react-router-dom';

const CorregirIncidente = () => {
    const { id } = useParams();

    const empleados = [
        { id: 1, nombre: 'Juan Perez' },
        { id: 2, nombre: 'Maria Gomez' },
        { id: 3, nombre: 'Carlos Lopez' },
    ];

    // Dummy incident data for pre-filling the form
    const incidente = {
        id: id,
        tipo_incid: 'Ausencia Injustificada',
        fecha_incid: '2025-10-25',
        descripcion_incid: 'El empleado no se presentó a trabajar sin previo aviso.',
        empleados_involucrados: [1], // IDs of involved employees
        observaciones: 'Ninguna.'
    };

    return (
        <div className="max-w-2xl mx-auto">
            <Link to={`/incidentes/${incidente.id}`} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500 mb-6">
                <ArrowLeft size={16} /> Volver al Incidente
            </Link>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Corregir Incidente #{incidente.id}</h2>
                <form className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tipo de Incidente</label>
                        <input type="text" defaultValue={incidente.tipo_incid} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Fecha del Incidente</label>
                        <input type="date" defaultValue={incidente.fecha_incid} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Descripción del Incidente</label>
                        <textarea rows="4" defaultValue={incidente.descripcion_incid} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white"></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Empleados Involucrados</label>
                        <div className="mt-2 p-2 border rounded-lg max-h-48 overflow-y-auto space-y-1 dark:border-gray-600">
                            {empleados.map(empleado => (
                                <label key={empleado.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                                    <input type="checkbox" defaultChecked={incidente.empleados_involucrados.includes(empleado.id)} className="form-checkbox h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500" />
                                    <span className="font-medium text-sm text-gray-900 dark:text-white">{empleado.nombre}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Observaciones</label>
                        <textarea rows="4" defaultValue={incidente.observaciones} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white"></textarea>
                    </div>
                    
                    <div className="mt-8 pt-4 border-t dark:border-gray-700 flex justify-end gap-3">
                        <Link to={`/incidentes/${incidente.id}`} className="px-4 py-2 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">Cancelar</Link>
                        <button type="submit" className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Guardar Corrección</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CorregirIncidente;