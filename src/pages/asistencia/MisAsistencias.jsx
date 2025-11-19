
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
        <div className="bg-gray-800 text-white p-4 rounded-lg">
            <h1 className="text-2xl mb-4">Mis Asistencias</h1>
            <div className="bg-gray-700 rounded-xl shadow-sm p-6">
                {/* Filter Form */}
                <form onSubmit={handleFilterSubmit} className="bg-gray-700 rounded-xl mb-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 items-end">
                        <div className="md:col-span-2">
                            <label className="block mb-2 text-sm font-medium text-white">Periodo</label>
                            <div className="flex items-center gap-2">
                                <select name="month" value={filters.month} onChange={handleFilterChange} className="w-full px-4 py-2 rounded-lg border bg-gray-800 border-gray-600 focus:ring-red-500 focus:border-red-500">
                                    <option value="">Mes</option>
                                    {Array.from({ length: 12 }, (_, i) => <option key={i} value={i + 1}>{new Date(0, i).toLocaleString('es-ES', { month: 'long' })}</option>)}
                                </select>
                                <select name="year" value={filters.year} onChange={handleFilterChange} className="w-full px-4 py-2 rounded-lg border bg-gray-800 border-gray-600 focus:ring-red-500 focus:border-red-500">
                                    <option value="">Año</option>
                                    {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
                                </select>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="por_pagina" className="block mb-2 text-sm font-medium text-white">Registros</label>
                            <select name="por_pagina" id="por_pagina" value={recordsPerPage} onChange={(e) => setRecordsPerPage(Number(e.target.value))} className="w-full px-4 py-2 rounded-lg border bg-gray-800 border-gray-600 focus:ring-red-500 focus:border-red-500">
                                <option value="10">10</option>
                                <option value="20">20</option>
                                <option value="30">30</option>
                                <option value="50">50</option>
                            </select>
                        </div>
                        <div className="flex gap-2 md:col-span-1">
                            <button type="submit" className="w-full bg-red-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-red-700">
                                <Filter size={16} /><span>Filtrar</span>
                            </button>
                        </div>
                        <div className="flex gap-2 md:col-span-1">
                            <button type="button" onClick={clearFilters} className="w-full bg-gray-500 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-600">
                                <RotateCw size={16} /><span>Limpiar</span>
                            </button>
                        </div>
                    </div>
                </form>

                {loading ? (
                    <div className="flex justify-center items-center p-8"><Loader className="animate-spin mr-2" /> Cargando tus asistencias...</div>
                ) : error ? (
                    <div className="flex justify-center items-center p-8 text-red-500"><AlertCircle className="mr-2" /> {error}</div>
                ) : filteredAsistencias.length > 0 ? (
                    <div className="overflow-x-auto mt-6">
                        <table className="w-full">
                            <thead className="bg-gray-600 text-left text-sm font-semibold text-gray-300">
                                <tr>
                                    <th className="p-4">Fecha</th>
                                    <th className="p-4">Día</th>
                                    <th className="p-4">Hora de Entrada</th>
                                    <th className="p-4">Minutos de Retraso</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-600">
                                {filteredAsistencias.map((asistencia) => (
                                    <tr key={asistencia.id} className="bg-gray-700 hover:bg-gray-600">
                                        <td className="p-4 text-gray-300">{new Date(asistencia.fecha_hora).toLocaleDateString('es-AR', { timeZone: 'UTC' })}</td>
                                        <td className="p-4 text-gray-300">{new Date(asistencia.fecha_hora).toLocaleDateString('es-ES', { weekday: 'long' })}</td>
                                        <td className="p-4 font-semibold text-gray-100">{new Date(asistencia.fecha_hora).toLocaleTimeString('es-AR', { timeZone: 'UTC' })}</td>
                                        <td className="p-4 font-semibold">
                                            {asistencia.minutos_retraso > 5 ? (
                                                <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-red-300 bg-red-900 rounded-full">
                                                    {asistencia.minutos_retraso} min - Tarde
                                                </span>
                                            ) : asistencia.minutos_retraso > 0 ? (
                                                <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-yellow-300 bg-yellow-900 rounded-full">
                                                    {asistencia.minutos_retraso} min - A tiempo
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-green-300 bg-green-900 rounded-full">
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
                    <div className="text-center py-10">
                        <div className="mx-auto h-12 w-12 rounded-full bg-gray-600 flex items-center justify-center mb-4">
                            <CalendarDays className="h-6 w-6 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-1">No se encontraron asistencias</h3>
                        <p className="text-sm text-gray-400">No se encontraron asistencias que coincidan con los filtros aplicados.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MisAsistencias;
