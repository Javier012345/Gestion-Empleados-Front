import React, { useState, useEffect } from 'react';
import { Filter, User, Search, ToggleLeft, Calendar, RotateCcw, Activity, Clock, Loader, AlertTriangle } from 'lucide-react';
import { getHistorialAsignacionesDetallado } from '../../services/api';

const HistorialHorarios = () => {
    const [historial, setHistorial] = useState([]);
    const [filteredHistorial, setFilteredHistorial] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({
        dni: '',
        nombreApellido: '',
        estado: '',
        mes: '',
        año: ''
    });

    const handleFilterChange = (e) => {
        const { name, value } = e.target;

        if (name === 'dni') {
            if (/^[0-9]*$/.test(value)) {
                setFilters(prev => ({ ...prev, [name]: value }));
            }
        } else if (name === 'nombreApellido') {
            if (/^[a-zA-Z\u00C0-\u017F\sñÑ]*$/.test(value)) {
                setFilters(prev => ({ ...prev, [name]: value }));
            }
        } else {
            setFilters(prev => ({ ...prev, [name]: value }));
        }
    };

    const resetFilters = () => {
        setFilters({
            dni: '',
            nombreApellido: '',
            estado: '',
            mes: '',
            año: ''
        });
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                setError('');

                const response = await getHistorialAsignacionesDetallado();
                setHistorial(response.data);

            } catch (err) {
                setError('Error al cargar el historial. Inténtalo de nuevo.');
                console.error("Error fetching history:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        let filteredData = historial;

        if (filters.dni) {
            filteredData = filteredData.filter(item =>
                String(item.id_empl.dni).includes(filters.dni)
            );
        }

        if (filters.nombreApellido) {
            filteredData = filteredData.filter(item =>
                `${item.id_empl.nombre} ${item.id_empl.apellido}`.toLowerCase().includes(filters.nombreApellido.toLowerCase())
            );
        }

        if (filters.estado) {
            const estadoActivo = filters.estado === 'activo';
            filteredData = filteredData.filter(item => item.estado === estadoActivo);
        }

        if (filters.mes) {
            filteredData = filteredData.filter(item => {
                const itemMonth = new Date(item.fecha_asignacion).getUTCMonth() + 1;
                return itemMonth === parseInt(filters.mes);
            });
        }

        if (filters.año) {
            filteredData = filteredData.filter(item => {
                const itemYear = new Date(item.fecha_asignacion).getUTCFullYear();
                return itemYear === parseInt(filters.año);
            });
        }

        const historialProcesado = filteredData.map(item => ({
            ...item,
            empleado: `${item.id_empl.nombre} ${item.id_empl.apellido}`,
            horario: item.id_horario.nombre,
        }));

        setFilteredHistorial(historialProcesado);
    }, [filters, historial]);

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
                                <input 
                                    type="text" 
                                    name="dni"
                                    value={filters.dni}
                                    onChange={handleFilterChange}
                                    className="pl-10 w-full rounded-lg border-gray-500 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200 text-gray-900 dark:text-white" 
                                />
                            </div>
                        </div>

                        <div className="group">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Nombre o Apellido</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-red-500 transition-colors">
                                    <Search className="w-5 h-5" />
                                </span>
                                <input 
                                    type="text" 
                                    name="nombreApellido"
                                    value={filters.nombreApellido}
                                    onChange={handleFilterChange}
                                    className="pl-10 w-full rounded-lg border-gray-500 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200 text-gray-900 dark:text-white" 
                                />
                            </div>
                        </div>

                        <div className="group">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Estado</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-red-500 transition-colors">
                                    <ToggleLeft className="w-5 h-5" />
                                </span>
                                <select 
                                    name="estado"
                                    value={filters.estado}
                                    onChange={handleFilterChange}
                                    className="pl-10 w-full rounded-lg border-gray-500 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 cursor-pointer transition-all duration-200 text-gray-900 dark:text-white">
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
                                    <select 
                                        name="mes"
                                        value={filters.mes}
                                        onChange={handleFilterChange}
                                        className="pl-9 w-full rounded-lg border-gray-500 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 cursor-pointer text-sm transition-all duration-200 text-gray-900 dark:text-white">
                                        <option value="">Mes</option>
                                        {[...Array(12).keys()].map(i => <option key={i+1} value={i+1}>{new Date(0, i).toLocaleString('es-ES', { month: 'long' })}</option>)}
                                    </select>
                                </div>
                                <div className="relative group">
                                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-red-500 transition-colors">
                                        <Calendar className="w-4 h-4" />
                                    </span>
                                    <select 
                                        name="año"
                                        value={filters.año}
                                        onChange={handleFilterChange}
                                        className="pl-9 w-full rounded-lg border-gray-500 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 cursor-pointer text-sm transition-all duration-200 text-gray-900 dark:text-white">
                                        <option value="">Año</option>
                                        {[2023, 2024, 2025].map(year => <option key={year} value={year}>{year}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 flex justify-end">
                        <button type="button" onClick={resetFilters} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">
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

                {!isLoading && !error && filteredHistorial.length > 0 && (
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
                                {filteredHistorial.map(item => (
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
                {!isLoading && !error && filteredHistorial.length === 0 && (
                    <div className="text-center py-10 px-6"><p className="text-gray-500 dark:text-gray-400">No se encontraron registros para los filtros seleccionados.</p></div>
                )}
            </div>
        </div>
    );
};

export default HistorialHorarios;