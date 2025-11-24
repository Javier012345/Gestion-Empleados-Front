
import React, { useState, useEffect, useMemo } from 'react';
import { getMisAsistencias } from '../../services/api';
import { Loader, AlertCircle, Filter, RotateCw, CalendarDays } from 'lucide-react';

const MisAsistencias = () => {
    const [allAsistencias, setAllAsistencias] = useState([]);
    const [filteredAsistencias, setFilteredAsistencias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [filters, setFilters] = useState({ month: '', year: '' });
    const [recordsPerPage, setRecordsPerPage] = useState(10);

    const availableYears = useMemo(() => {
        if (allAsistencias.length === 0) return [];
        const years = [...new Set(allAsistencias.map(a => new Date(a.fecha_hora).getFullYear()))];
        return years.sort((a, b) => b - a);
    }, [allAsistencias]);

    useEffect(() => {
        const fetchAsistencias = async () => {
            try {
                setLoading(true);
                const response = await getMisAsistencias();
                console.log('Datos de asistencias recibidos:', response.data);
                setAllAsistencias(response.data);
                setError(null);
            } catch (err) {
                setError("No se pudieron cargar tus asistencias.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAsistencias();
    }, []);

    useEffect(() => {
        if (loading) return;

        const filtered = allAsistencias.filter(asistencia => {
            const date = new Date(asistencia.fecha_hora);
            const monthMatch = filters.month ? (date.getMonth() + 1) === parseInt(filters.month) : true;
            const yearMatch = filters.year ? date.getFullYear() === parseInt(filters.year) : true;
            return monthMatch && yearMatch;
        });

        setFilteredAsistencias(filtered.slice(0, recordsPerPage));
    }, [filters, recordsPerPage, allAsistencias, loading]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleFilterSubmit = (e) => {
        e.preventDefault();
        // El useEffect se encargará de re-filtrar
    };

    const clearFilters = () => {
        setFilters({ month: '', year: '' });
    };

    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800/50 rounded-xl border border-gray-300 dark:border-gray-700 p-6">
                <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/20">
                        <CalendarDays className="h-5 w-5 text-red-600 dark:text-red-400" />
                    </span>
                    <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">Mis Asistencias</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Aquí puedes ver todo tu historial de asistencias.</p>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                {/* Filter Form */}
                <form onSubmit={handleFilterSubmit} className="mb-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 items-end">
                        <div className="md:col-span-2">
                            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Periodo</label>
                            <div className="flex items-center gap-2">
                                <select name="month" value={filters.month} onChange={handleFilterChange} className="w-full px-4 py-2 rounded-lg border bg-white border-gray-300 text-gray-900 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                    <option value="">Mes</option>
                                    {Array.from({ length: 12 }, (_, i) => <option key={i} value={i + 1}>{new Date(0, i).toLocaleString('es-ES', { month: 'long' })}</option>)}
                                </select>
                                <select name="year" value={filters.year} onChange={handleFilterChange} className="w-full px-4 py-2 rounded-lg border bg-white border-gray-300 text-gray-900 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                    <option value="">Año</option>
                                    {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
                                </select>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="por_pagina" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Registros</label>
                            <select name="por_pagina" id="por_pagina" value={recordsPerPage} onChange={(e) => setRecordsPerPage(Number(e.target.value))} className="w-full px-4 py-2 rounded-lg border bg-white border-gray-300 text-gray-900 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                <option value="10">10</option>
                                <option value="20">20</option>
                                <option value="30">30</option>
                                <option value="50">50</option>
                            </select>
                        </div>
                        <div className="flex gap-2 md:col-span-2">
                            <button type="submit" className="w-full bg-red-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-red-700">
                                <Filter size={16} /><span>Filtrar</span>
                            </button>
                            <button type="button" onClick={clearFilters} className="w-full bg-gray-200 text-gray-800 px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-300 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">
                                <RotateCw size={16} /><span>Limpiar</span>
                            </button>
                        </div>
                    </div>
                </form>

                {loading ? (
                    <div className="flex justify-center items-center p-8 text-gray-800 dark:text-gray-200"><Loader className="animate-spin mr-2" /> Cargando tus asistencias...</div>
                ) : error ? (
                    <div className="flex justify-center items-center p-8 text-red-500"><AlertCircle className="mr-2" /> {error}</div>
                ) : filteredAsistencias.length > 0 ? (
                    <div className="overflow-x-auto mt-6">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="p-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Fecha</th>
                                    <th className="p-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Día</th>
                                    <th className="p-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Hora de Entrada</th>
                                    <th className="p-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Minutos de Retraso</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {filteredAsistencias.map((asistencia) => (
                                    <tr key={asistencia.id} className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <td className="p-4 text-gray-800 dark:text-gray-300">{new Date(asistencia.fecha_hora).toLocaleDateString('es-AR', { timeZone: 'UTC' })}</td>
                                        <td className="p-4 text-gray-800 dark:text-gray-300">{new Date(asistencia.fecha_hora).toLocaleDateString('es-ES', { weekday: 'long' })}</td>
                                        <td className="p-4 font-semibold text-gray-900 dark:text-gray-100">{new Date(asistencia.fecha_hora).toLocaleTimeString('es-AR', { timeZone: 'UTC' })}</td>
                                        <td className="p-4 font-semibold">
                                            {asistencia.minutos_retraso > 5 ? (
                                                <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-full dark:bg-red-900 dark:text-red-300">
                                                    {asistencia.minutos_retraso} min - Tarde
                                                </span>
                                            ) : asistencia.minutos_retraso > 0 ? (
                                                <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-yellow-700 bg-yellow-100 rounded-full dark:bg-yellow-900 dark:text-yellow-300">
                                                    {asistencia.minutos_retraso} min - A tiempo
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full dark:bg-green-900 dark:text-green-300">
                                                    En horario
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {/* Pagination would go here */}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="mx-auto h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
                            <CalendarDays className="h-6 w-6 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">No se encontraron asistencias</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">No se encontraron asistencias que coincidan con los filtros aplicados.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MisAsistencias;
