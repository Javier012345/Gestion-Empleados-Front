import React, { useState, useEffect, useMemo } from 'react';
import { getEmpleadosBasico, getAsistenciasByEmpleadoId } from '../../services/api';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const VerAsistenciasTab = () => {
    const [empleados, setEmpleados] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedEmpleado, setSelectedEmpleado] = useState(null);
    const [asistencias, setAsistencias] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEmpleados = async () => {
            try {
                const response = await getEmpleadosBasico();
                setEmpleados(response.data);
            } catch (err) {
                setError('No se pudo cargar la lista de empleados.');
                console.error(err);
            }
        };
        fetchEmpleados();
    }, []);

    useEffect(() => {
        if (selectedEmpleado) {
            // Vuelve a cargar las asistencias si cambia la página actual
            fetchAsistencias(selectedEmpleado, currentPage);
        }
    }, [currentPage, selectedEmpleado]); // eslint-disable-line react-hooks/exhaustive-deps

    const filteredEmpleados = useMemo(() => {
        if (!searchTerm) return [];
        return (empleados || []).filter(emp => 
            emp.dni.toString().startsWith(searchTerm)
        ).slice(0, 5); // Mostramos solo los primeros 5 resultados
    }, [searchTerm, empleados]);

    const handleSelectEmpleado = async (empleado) => {
        setSelectedEmpleado(empleado);
        setSearchTerm(''); // Limpia la búsqueda
        setCurrentPage(1); // Resetea a la primera página
        await fetchAsistencias(empleado, 1);
    };

    const fetchAsistencias = async (empleado, page) => {
        setLoading(true);
        setError('');
        setAsistencias([]);

        try {
            const response = await getAsistenciasByEmpleadoId(empleado.id, page);
            console.log('Respuesta de asistencias:', response.data); // Log para depuración
            // Ajuste: La API devuelve un array directamente, no un objeto con 'results'.
            if (Array.isArray(response.data)) {
                setAsistencias(response.data);
            } else {
                setAsistencias(response.data.results ?? []);
                setPagination(response.data.pagination);
            }
        } catch (err) {
            setError(`No se pudieron cargar las asistencias para ${empleado.nombre_completo}.`);
            setPagination(null);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (newPage) => {
        if (pagination && newPage >= 1 && newPage <= pagination.num_pages) {
            setCurrentPage(newPage);
        }
    };

    return (
        <div className="container mx-auto">
            <h2 className="text-2xl font-bold mb-4">Ver Asistencias por Empleado</h2>

            {/* Buscador de Empleados */}
            <div className="mb-6 relative max-w-md">
                <label htmlFor="search-dni" className="block text-sm font-medium text-gray-300 mb-1">
                    Buscar Empleado por DNI
                </label>
                <input
                    id="search-dni"
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Comience a escribir el DNI..."
                    className="w-full p-2 bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                />
                {filteredEmpleados.length > 0 && (
                    <ul className="absolute z-10 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md mt-1 max-h-60 overflow-y-auto shadow-lg">
                        {filteredEmpleados.map(emp => (
                            <li
                                key={emp.id}
                                onClick={() => handleSelectEmpleado(emp)}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-gray-800 dark:text-gray-200"
                            >
                                {`${emp.nombre} ${emp.apellido}`} - {emp.dni}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Resultados de Asistencia */}
            {selectedEmpleado ? (
                <div>
                    <h3 className="text-xl font-semibold mb-3">
                        Asistencias de: <span className="text-blue-600 dark:text-blue-400">{selectedEmpleado.nombre_completo}</span>
                    </h3>
                    {loading && <p className="text-gray-600 dark:text-gray-400">Cargando asistencias...</p>}
                    {error && <p className="text-red-500 dark:text-red-400">{error}</p>}
                    {!loading && asistencias.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                                <thead className="bg-gray-50 dark:bg-gray-900">
                                    <tr>
                                        <th className="p-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Fecha</th>
                                        <th className="p-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Hora de Entrada</th>
                                        <th className="p-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Minutos de Retraso</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {asistencias.map(asistencia => (
                                        <tr key={asistencia.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                                            <td className="p-3 text-gray-700 dark:text-gray-300">{new Date(asistencia.fecha_hora).toLocaleDateString('es-ES')}</td>
                                            <td className="p-3">{new Date(asistencia.fecha_hora).toLocaleTimeString('es-ES', {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                second: '2-digit'
                                            })}</td>
                                            <td className="p-3">
                                                {asistencia.minutos_retraso > 5 ? (
                                                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-full dark:bg-red-900 dark:text-red-300">
                                                        {asistencia.minutos_retraso} min - TARDE
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full dark:bg-green-900 dark:text-green-300">
                                                        {asistencia.minutos_retraso} min - NORMAL
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        !loading && !error && <p className="text-gray-500 dark:text-gray-400">No se encontraron registros de asistencia para este empleado.</p>
                    )}

                    {/* Controles de Paginación */}
                    {pagination && pagination.num_pages > 1 && (
                        <div className="flex justify-between items-center mt-4">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={!pagination.has_previous}
                                className="flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-600"
                            >
                                <ChevronLeft size={16} className="mr-2" /> Anterior
                            </button>
                            <span className="text-sm text-gray-700 dark:text-gray-400">
                                Página {pagination.number} de {pagination.num_pages}
                            </span>
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={!pagination.has_next}
                                className="flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-600"
                            >
                                Siguiente <ChevronRight size={16} className="ml-2" />
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">Buscar asistencias de empleado</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Ingresa un DNI para ver las asistencias de un empleado.</p>
                </div>
            )}
        </div>
    );
};

export default VerAsistenciasTab;