import React, { useState, useEffect } from 'react';
import { Filter, User, Search, ToggleLeft, Calendar, RotateCcw, Activity, Clock, Loader, AlertTriangle } from 'lucide-react';
import { getHistorialAsignacionesDetallado } from '../../services/api';

const HistorialHorarios = () => {
    const [historial, setHistorial] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                setError('');

                const response = await getHistorialAsignacionesDetallado();

                const historialProcesado = response.data.map(item => ({
                    ...item,
                    empleado: `${item.id_empl.nombre} ${item.id_empl.apellido}`,
                    horario: item.id_horario.nombre,
                }));
                setHistorial(historialProcesado);

            } catch (err) {
                setError('Error al cargar el historial. Inténtalo de nuevo.');
                console.error("Error fetching history:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-AR', { timeZone: 'UTC' });
    };

    return (
        <div className="space-y-6 text-gray-900 dark:text-gray-100">
            <div className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800/50 rounded-xl border border-gray-300 dark:border-gray-700 overflow-hidden shadow-sm">
                <div className="p-4 border-b border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50">
                    <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/20">
                            <Filter className="h-5 w-5 text-red-600 dark:text-red-400" />
                        </span>
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">Filtros del Historial</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Utiliza los filtros para encontrar registros específicos</p>
                        </div>
                    </div>
                </div>
                
                <form className="p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="group">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">DNI</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-red-500 transition-colors">
                                    <User className="w-5 h-5" />
                                </span>
                                <input type="text" className="pl-10 w-full rounded-lg border-gray-500 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200 text-gray-900 dark:text-white" />
                            </div>
                        </div>

                        <div className="group">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Nombre o Apellido</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-red-500 transition-colors">
                                    <Search className="w-5 h-5" />
                                </span>
                                <input type="text" className="pl-10 w-full rounded-lg border-gray-500 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200 text-gray-900 dark:text-white" />
                            </div>
                        </div>

                        <div className="group">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Estado</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-red-500 transition-colors">
                                    <ToggleLeft className="w-5 h-5" />
                                </span>
                                <select className="pl-10 w-full rounded-lg border-gray-500 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 cursor-pointer transition-all duration-200 text-gray-900 dark:text-white">
                                    <option value="">Todos</option>
                                    <option value="activo">Activo</option>
                                    <option value="inactivo">Inactivo</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Período</label>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="relative group">
                                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-red-500 transition-colors">
                                        <Calendar className="w-4 h-4" />
                                    </span>
                                    <select className="pl-9 w-full rounded-lg border-gray-500 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 cursor-pointer text-sm transition-all duration-200 text-gray-900 dark:text-white">
                                        <option value="">Mes</option>
                                        {[...Array(12).keys()].map(i => <option key={i+1} value={i+1}>{new Date(0, i).toLocaleString('es-ES', { month: 'long' })}</option>)}
                                    </select>
                                </div>
                                <div className="relative group">
                                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-red-500 transition-colors">
                                        <Calendar className="w-4 h-4" />
                                    </span>
                                    <select className="pl-9 w-full rounded-lg border-gray-500 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 cursor-pointer text-sm transition-all duration-200 text-gray-900 dark:text-white">
                                        <option value="">Año</option>
                                        {[2023, 2024, 2025].map(year => <option key={year} value={year}>{year}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 flex justify-end">
                        <button type="reset" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                            <RotateCcw className="w-4 h-4" />
                            <span>Limpiar Filtros</span>
                        </button>
                    </div>
                </form>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-300 dark:border-gray-700 overflow-hidden">
                {isLoading && (
                    <div className="flex justify-center items-center p-8 text-gray-800 dark:text-gray-200"><Loader className="animate-spin mr-2" /> Cargando historial...</div>
                )}
                {error && (
                    <div className="flex justify-center items-center p-8 text-red-600 dark:text-red-400"><AlertTriangle className="mr-2" /> {error}</div>
                )}

                {!isLoading && !error && (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700/50">
                            <tr>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        <User className="w-4 h-4" />
                                        <span>Empleado</span>
                                    </div>
                                </th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        <span>Horario</span>
                                    </div>
                                </th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        <span>Fecha de Asignación</span>
                                    </div>
                                </th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        <Activity className="w-4 h-4" />
                                        <span>Estado</span>
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {historial.map(item => (
                                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{item.empleado}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{item.horario}</td>                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{formatDate(item.fecha_asignacion)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.estado ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'}`}>
                                            {item.estado ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                )}
            </div>
        </div>
    );
};

export default HistorialHorarios;