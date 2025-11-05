import React from 'react';
import { Filter, RotateCw, Calendar, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

const MisIncidentes = () => {
    const incidentes = [
        {
            id: 1,
            tipo_incid: 'Ausencia Injustificada',
            descripcion_incid: 'El empleado no se presentó a trabajar sin previo aviso.',
            fecha_ocurrencia: '25/10/2025',
        },
        {
            id: 2,
            tipo_incid: 'Retraso Crónico',
            descripcion_incid: 'El empleado ha llegado tarde varias veces en la última semana.',
            fecha_ocurrencia: '20/10/2025',
        },
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <form className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 items-end">
                    <div className="md:col-span-2">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Periodo</label>
                        <div className="flex items-center gap-2">
                            <select className="w-full pl-4 pr-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white">
                                <option value="">Mes</option>
                                {[...Array(12).keys()].map(i => <option key={i+1} value={i+1}>{new Date(0, i).toLocaleString('es-ES', { month: 'long' })}</option>)}
                            </select>
                            <select className="w-full pl-4 pr-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white">
                                <option value="">Año</option>
                                {[2023, 2024, 2025].map(year => <option key={year} value={year}>{year}</option>)}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Estado</label>
                        <select className="mt-1 w-full pl-4 pr-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white">
                            <option value="">Todos</option>
                            <option value="ABIERTO">Abierto</option>
                            <option value="CERRADO">Cerrado</option>
                        </select>
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Registros</label>
                        <select className="w-full mt-1 px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 focus:ring-red-500 focus:border-red-500 text-gray-900 dark:text-white">
                            <option value="9">9</option>
                            <option value="12">12</option>
                            <option value="18">18</option>
                        </select>
                    </div>
                    <div className="flex items-end gap-2 ">
                        <button type="submit" className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
                            <Filter size={16} />Filtrar
                        </button>
                        <Link to="/mis-incidentes" className="w-full text-center px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
                            <RotateCw size={16} />Limpiar
                        </Link>
                    </div>
                </div>
            </form>

            {incidentes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {incidentes.map(incidente => (
                        <div key={incidente.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 flex flex-col">
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-bold text-lg mb-1 text-gray-900 dark:text-white">{incidente.tipo_incid}</h3>
                                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{incidente.fecha_ocurrencia}</span>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{incidente.descripcion_incid}</p>
                            </div>
                            <div className="border-t dark:border-gray-700 pt-4 flex justify-between items-center">
                                <div></div>
                                <Link to={`/incidentes/${incidente.id}`} className="text-sm font-semibold text-red-600 hover:underline">Ver Detalle</Link>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="col-span-full text-center py-10 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                    <AlertTriangle className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">No se encontraron incidentes</h3>
                    <p className="mt-1 text-sm text-gray-500">No se encontraron incidentes que coincidan con los filtros aplicados o no tienes incidentes registrados.</p>
                </div>
            )}
        </div>
    );
};

export default MisIncidentes;