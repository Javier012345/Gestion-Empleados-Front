import React, { useState, useEffect } from 'react';
import { Plus, Filter, RotateCw, ArrowRight, Loader, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getIncidentesAgrupados } from '../../services/api';

const Incidentes = () => {
    const [incidentes, setIncidentes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchIncidentes = async () => {
            try {
                setIsLoading(true);
                const response = await getIncidentesAgrupados();
                setIncidentes(response.data);
            } catch (err) {
                setError('No se pudieron cargar los incidentes. Inténtalo de nuevo más tarde.');
                console.error("Error fetching incidents:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchIncidentes();
    }, []);

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gestión de Incidentes</h1>
                <Link to="/incidentes/registrar" className="w-full sm:w-auto flex-shrink-0 bg-red-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-red-700">
                    <Plus size={20} /><span>Registrar Incidente</span>
                </Link>
            </div>

            <form className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 items-end">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Buscar por Empleado</label>
                        <input type="text" placeholder="Nombre o DNI..." className="mt-1 w-full pl-4 pr-4 py-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Periodo</label>
                        <div className="flex gap-2 mt-1">
                            <select className="w-full pl-4 pr-4 py-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                                <option value="">Mes</option>
                                {[...Array(12).keys()].map(i => <option key={i+1} value={i+1}>{new Date(0, i).toLocaleString('es-ES', { month: 'long' })}</option>)}
                            </select>
                            <select className="w-full pl-4 pr-4 py-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                                <option value="">Año</option>
                                {[2023, 2024, 2025].map(year => <option key={year} value={year}>{year}</option>)}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Estado</label>
                        <select className="mt-1 w-full pl-4 pr-4 py-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                            <option value="">Todos</option>
                            <option value="ABIERTO">Abierto</option>
                            <option value="CERRADO">Cerrado</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-900 dark:text-white">Registros</label>
                        <select className="w-full mt-1 px-4 py-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-red-500 focus:border-red-500 text-gray-900 dark:text-white">
                            <option value="9">9</option>
                            <option value="12">12</option>
                            <option value="18">18</option>
                            <option value="24">24</option>
                        </select>
                    </div>
                    <div className="flex gap-2 md:col-span-2">
                        <button type="submit" className="w-full bg-red-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-red-700">
                            <Filter size={16} /><span>Filtrar</span>
                        </button>
                        <Link to="/incidentes" className="w-full bg-gray-300 text-gray-800 px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-400 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">
                            <RotateCw size={16} /><span>Limpiar</span>
                        </Link>
                    </div>
                </div>
            </form>

            {isLoading && (
                <div className="flex justify-center items-center p-8"><Loader className="animate-spin mr-2" /> Cargando incidentes...</div>
            )}
            {error && (
                <div className="flex justify-center items-center p-8 text-red-500"><AlertTriangle className="mr-2" /> {error}</div>
            )}

            {!isLoading && !error && incidentes.length > 0 ? (
                <div id="incidentesGrid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {incidentes.map(incidente => (
                        <div key={incidente.grupo_incidente} className="incidente-card bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 flex flex-col border dark:border-gray-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                            <div className="flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100">{incidente.incidente.tipo_incid}</h3>
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${incidente.estado === 'ABIERTO' ? 'text-yellow-800 bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-300' : 'text-green-800 bg-green-200 dark:bg-green-900 dark:text-green-300'}`}>
                                        {incidente.estado === 'ABIERTO' ? 'Abierto' : 'Cerrado'}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 h-10 overflow-hidden">{incidente.descripcion}</p>
                            </div>
                            <div className="border-t dark:border-gray-700 pt-4">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Involucrados:</span>
                                        <div className="flex -space-x-2 mt-2">
                                            {incidente.empleados_involucrados.map(empleado => (
                                                <span key={empleado.id} className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-gray-800 bg-gray-200 dark:bg-gray-700 flex items-center justify-center font-bold text-gray-500 text-xs" title={`${empleado.nombre} ${empleado.apellido}`}>
                                                    {`${empleado.nombre[0]}${empleado.apellido[0]}`}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{new Date(incidente.fecha_ocurrencia).toLocaleDateString('es-AR', { timeZone: 'UTC' })}</span>
                                        <Link to={`/incidentes/${incidente.grupo_incidente}`} className="block mt-2 text-sm font-semibold text-red-600 hover:text-red-800 dark:hover:text-red-400">Ver Detalle <ArrowRight className="inline-block h-4 w-4" /></Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                !isLoading && !error && <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                    <AlertTriangle className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">No hay incidentes</h3>
                    <p className="mt-1 text-sm text-gray-500">No se encontraron incidentes con los filtros aplicados. Puedes <Link to="/incidentes/registrar" className="text-red-500 hover:underline">registrar uno nuevo</Link> o <Link to="/incidentes" className="text-red-500 hover:underline">limpiar los filtros</Link>.</p>
                </div>
            )}
        </div>
    );
};

export default Incidentes;