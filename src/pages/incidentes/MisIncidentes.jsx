import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ChevronLeft, ChevronRight, Loader } from 'lucide-react';
import { getMisIncidentes } from '../../services/api';

const MisIncidentes = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [allIncidentes, setAllIncidentes] = useState([]);
    const [filters, setFilters] = useState({ month: '', year: '', status: '' });
    const [recordsPerPage, setRecordsPerPage] = useState(9);
    const [currentPage, setCurrentPage] = useState(1);
    const [pagedData, setPagedData] = useState({ data: [], total_records: 0, total_pages: 0 });

    const years = useMemo(() => {
        const currentYear = new Date().getFullYear();
        const startYear = currentYear - 10;
        return Array.from({ length: currentYear - startYear + 1 }, (_, i) => currentYear - i);
    }, []);

    useEffect(() => {
        const fetchAndFilterData = () => {
            if (loading) return; // No filtrar si los datos iniciales no han cargado
    
            const filtered = allIncidentes.filter(inc => {
                const date = new Date(inc.fecha_ocurrencia);
                const monthMatch = filters.month ? (date.getMonth() + 1) === parseInt(filters.month) : true;
                const yearMatch = filters.year ? date.getFullYear() === parseInt(filters.year) : true;
                const statusMatch = filters.status ? inc.estado === filters.status : true;
                return monthMatch && yearMatch && statusMatch;
            });
    
            const totalRecords = filtered.length;
            const totalPages = Math.ceil(totalRecords / recordsPerPage);
            const startIndex = (currentPage - 1) * recordsPerPage;
            const paginatedRecords = filtered.slice(startIndex, startIndex + recordsPerPage);
    
            setPagedData({
                data: paginatedRecords,
                total_records: totalRecords,
                total_pages: totalPages,
                start_index: startIndex + 1,
                end_index: startIndex + paginatedRecords.length
            });
        };
        fetchAndFilterData();
    }, [filters, recordsPerPage, currentPage, allIncidentes, loading]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await getMisIncidentes();
                setAllIncidentes(response.data);
                setError(null);
            } catch (err) {
                setError("No se pudieron cargar tus incidentes.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
        setCurrentPage(1); // Reset page on filter change
    };

    const handleRecordsPerPageChange = (e) => {
        setRecordsPerPage(Number(e.target.value));
        setCurrentPage(1); // Reset page on records per page change
    };

    const handleFilterSubmit = (e) => {
        e.preventDefault();
        setCurrentPage(1);
    };

    const clearFilters = () => {
        setFilters({ month: '', year: '', status: '' });
        setCurrentPage(1);
    };

    const nextPage = () => {
        if (currentPage < pagedData.total_pages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Mis Incidentes</h1>

            <form onSubmit={handleFilterSubmit} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 items-end">
                    <div className="md:col-span-2">
                        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">Periodo</label>
                        <div className="flex items-center gap-2">
                            <select name="month" value={filters.month} onChange={handleFilterChange} className="w-full px-4 py-2 rounded-lg border bg-white border-gray-300 text-gray-900 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                <option value="">Mes</option>
                                {Array.from({ length: 12 }, (_, i) => <option key={i} value={i + 1}>{new Date(0, i).toLocaleString('es-ES', { month: 'long' })}</option>)}
                            </select>
                            <select name="year" value={filters.year} onChange={handleFilterChange} className="w-full px-4 py-2 rounded-lg border bg-white border-gray-300 text-gray-900 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                <option value="">Año</option>
                                {years.map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">Estado</label>
                        <select name="status" value={filters.status} onChange={handleFilterChange} className="w-full px-4 py-2 rounded-lg border bg-white border-gray-300 text-gray-900 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                            <option value="">Todos</option>
                            <option value="ABIERTO">Abierto</option>
                            <option value="CERRADO">Cerrado</option>
                        </select>
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">Registros</label>
                        <select value={recordsPerPage} onChange={handleRecordsPerPageChange} className="w-full px-4 py-2 rounded-lg border bg-white border-gray-300 text-gray-900 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                            <option value={9}>9</option>
                            <option value={12}>12</option>
                            <option value={18}>18</option>
                        </select>
                    </div>
                    <div className="flex items-end gap-2">
                        <button type="submit" className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">Filtrar</button>
                        <button type="button" onClick={clearFilters} className="w-full text-center px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-white">Limpiar</button>
                    </div>
                </div>
            </form>

            {loading ? (
                <div className="flex justify-center items-center p-8"><Loader className="animate-spin mr-2" /> Cargando tus incidentes...</div>
            ) : error ? (
                <div className="flex justify-center items-center p-8 text-red-500"><AlertTriangle className="mr-2" /> {error}</div>
            ) : pagedData.data.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {pagedData.data.map(incidente => (
                            <div key={incidente.grupo_incidente} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 flex flex-col">
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-bold text-lg mb-1 text-gray-900 dark:text-white">{incidente.id_incidente.tipo_incid}</h3>
                                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                            {new Date(incidente.fecha_ocurrencia).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{incidente.descripcion}</p>
                                </div>
                                <div className="border-t dark:border-gray-700 pt-4 flex justify-between items-center">
                                    <div></div>
                                    <Link to={`/mis-incidentes/${incidente.id}`} className="text-sm font-semibold text-red-600 hover:underline">
                                        Ver Detalle
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {/* Paginación */}
                    <div className="mt-8 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 px-4 py-3 sm:px-6">
                        <div className="flex-1 flex justify-between sm:hidden">
                            <button onClick={prevPage} disabled={currentPage === 1} className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"> Anterior </button>
                            <button onClick={nextPage} disabled={currentPage === pagedData.total_pages} className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"> Siguiente </button>
                        </div>
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    Mostrando <span className="font-medium">{pagedData.start_index}</span> a <span className="font-medium">{pagedData.end_index}</span> de <span className="font-medium">{pagedData.total_records}</span> resultados
                                </p>
                            </div>
                            <div>
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                    <button onClick={prevPage} disabled={currentPage === 1} className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                                        <span className="sr-only">Anterior</span>
                                        <ChevronLeft className="h-5 w-5" />
                                    </button>
                                    <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300"> Página {currentPage} de {pagedData.total_pages} </span>
                                    <button onClick={nextPage} disabled={currentPage === pagedData.total_pages} className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                                        <span className="sr-only">Siguiente</span>
                                        <ChevronRight className="h-5 w-5" />
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                </>
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