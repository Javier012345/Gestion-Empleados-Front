import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react';

// Mock data que simula la respuesta de la API
const mockApiResponse = {
    total_records: 8,
    total_pages: 1,
    current_page: 1,
    records: [
        {
            id_incidente: { id: 1, tipo_incid: 'Llegada Tarde', descripcion_incid: 'El empleado llegó 15 minutos tarde sin previo aviso.' },
            fecha_ocurrencia: '2024-10-25',
            estado: 'ABIERTO',
        },
        {
            id_incidente: { id: 2, tipo_incid: 'Ausencia Injustificada', descripcion_incid: 'El empleado no se presentó a trabajar y no comunicó el motivo.' },
            fecha_ocurrencia: '2024-10-20',
            estado: 'CERRADO',
        },
        {
            id_incidente: { id: 3, tipo_incid: 'Conflicto Laboral', descripcion_incid: 'Discusión con un compañero en el área de producción.' },
            fecha_ocurrencia: '2024-09-15',
            estado: 'CERRADO',
        },
        {
            id_incidente: { id: 4, tipo_incid: 'Incumplimiento de Tareas', descripcion_incid: 'No completó el reporte diario asignado.' },
            fecha_ocurrencia: '2024-09-10',
            estado: 'ABIERTO',
        },
    ]
};

const MisIncidentes = () => {
    const [incidentes, setIncidentes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({});
    const [filters, setFilters] = useState({ month: '', year: '', status: '' });
    const [recordsPerPage, setRecordsPerPage] = useState(9);

    const years = useMemo(() => {
        const currentYear = new Date().getFullYear();
        const startYear = currentYear - 10;
        return Array.from({ length: currentYear - startYear + 1 }, (_, i) => currentYear - i);
    }, []);

    useEffect(() => {
        fetchData();
    }, [filters, recordsPerPage]); // Se ejecuta cuando cambian los filtros o registros por página

    const fetchData = () => {
        setLoading(true);
        // --- SIMULACIÓN DE LLAMADA A LA API ---
        // En una app real, aquí llamarías a tu API con los filtros
        // ej: api.get('/mis-incidentes', { params: { ...filters, por_pagina: recordsPerPage, page: pagination.current_page } })
        console.log("Fetching data with filters:", { ...filters, por_pagina: recordsPerPage });
        setTimeout(() => {
            // Aquí filtrarías mockApiResponse basado en los `filters` para simular el backend
            setIncidentes(mockApiResponse.records);
            setPagination({
                total_records: mockApiResponse.total_records,
                total_pages: mockApiResponse.total_pages,
                current_page: mockApiResponse.current_page,
            });
            setLoading(false);
        }, 500);
        // --- FIN DE LA SIMULACIÓN ---
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleRecordsPerPageChange = (e) => {
        setRecordsPerPage(Number(e.target.value));
    };

    const handleFilterSubmit = (e) => {
        e.preventDefault();
        fetchData();
    };

    const clearFilters = () => {
        setFilters({ month: '', year: '', status: '' });
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6 dark:text-white">Mis Incidentes</h1>

            {/* Filter Form */}
            <form onSubmit={handleFilterSubmit} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 items-end">
                    <div className="md:col-span-2">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Periodo</label>
                        <div className="flex items-center gap-2">
                            <select name="month" value={filters.month} onChange={handleFilterChange} className="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 focus:ring-red-500 focus:border-red-500">
                                <option value="">Mes</option>
                                {Array.from({ length: 12 }, (_, i) => <option key={i} value={i + 1}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>)}
                            </select>
                            <select name="year" value={filters.year} onChange={handleFilterChange} className="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 focus:ring-red-500 focus:border-red-500">
                                <option value="">Año</option>
                                {years.map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Estado</label>
                        <select name="status" value={filters.status} onChange={handleFilterChange} className="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 focus:ring-red-500 focus:border-red-500">
                            <option value="">Todos</option>
                            <option value="ABIERTO">Abierto</option>
                            <option value="CERRADO">Cerrado</option>
                        </select>
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Registros</label>
                        <select value={recordsPerPage} onChange={handleRecordsPerPageChange} className="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 focus:ring-red-500 focus:border-red-500">
                            <option value={9}>9</option>
                            <option value={12}>12</option>
                            <option value={18}>18</option>
                        </select>
                    </div>
                    <div className="flex items-end gap-2">
                        <button type="submit" className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">Filtrar</button>
                        <button type="button" onClick={clearFilters} className="w-full text-center px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">Limpiar</button>
                    </div>
                </div>
            </form>

            {loading ? (
                <div className="text-center py-10">Cargando...</div>
            ) : incidentes.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {incidentes.map(incidente => (
                            <div key={incidente.id_incidente.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 flex flex-col">
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-bold text-lg mb-1 text-gray-900 dark:text-white">{incidente.id_incidente.tipo_incid}</h3>
                                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                            {new Date(incidente.fecha_ocurrencia).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{incidente.id_incidente.descripcion_incid}</p>
                                </div>
                                <div className="border-t dark:border-gray-700 pt-4 flex justify-between items-center">
                                    <div></div>
                                    <Link to={`/incidentes/${incidente.id_incidente.id}`} className="text-sm font-semibold text-red-600 hover:underline">
                                        Ver Detalle
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* Paginación */}
                    <div className="mt-8 flex items-center justify-between">
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                            Mostrando 1 a {incidentes.length} de {pagination.total_records} resultados
                        </p>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                            <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                                <ChevronLeft className="h-5 w-5" />
                            </button>
                            <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300">
                                Página {pagination.current_page} de {pagination.total_pages}
                            </span>
                            <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                                <ChevronRight className="h-5 w-5" />
                            </button>
                        </nav>
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