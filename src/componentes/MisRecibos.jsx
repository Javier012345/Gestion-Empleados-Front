
import React, { useState, useEffect } from 'react';
import { Filter, FileText, Image, Receipt } from 'lucide-react';

// --- Mock Data ---
// Simula los recibos para un empleado que ha iniciado sesión
const mockMisRecibos = [
    { id: 1, fecha_emision: "2023-10-15", periodo: "2023-09", ruta_pdf: "/recibos/mi_recibo_09_2023.pdf", ruta_imagen: null },
    { id: 2, fecha_emision: "2023-09-15", periodo: "2023-08", ruta_pdf: "/recibos/mi_recibo_08_2023.pdf", ruta_imagen: "/recibos/mi_recibo_08_2023.jpg" },
    { id: 3, fecha_emision: "2023-08-15", periodo: "2023-07", ruta_pdf: "/recibos/mi_recibo_07_2023.pdf", ruta_imagen: null },
    { id: 4, fecha_emision: "2022-12-15", periodo: "2022-11", ruta_pdf: "/recibos/mi_recibo_11_2022.pdf", ruta_imagen: null },
];

const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

// --- Componente: Mis Recibos ---
const MisRecibos = () => {
    const [recibos, setRecibos] = useState([]);
    const [filteredRecibos, setFilteredRecibos] = useState([]);
    const [filters, setFilters] = useState({ mes: '', anio: '' });
    const [availableYears, setAvailableYears] = useState([]);

    // Cargar datos iniciales
    useEffect(() => {
        // Aquí se haría la llamada a la API para obtener los recibos del usuario
        setRecibos(mockMisRecibos);
        const years = [...new Set(mockMisRecibos.map(r => new Date(r.fecha_emision).getFullYear()))];
        const sortedYears = years.sort((a, b) => b - a);
        setAvailableYears(sortedYears);
        // Establecer el año más reciente como filtro por defecto
        if (sortedYears.length > 0) {
            setFilters({ mes: '', anio: sortedYears[0].toString() });
        }
    }, []);

    // Aplicar filtros
    useEffect(() => {
        const filtered = recibos.filter(r => {
            const fecha = new Date(r.fecha_emision);
            const mesMatch = filters.mes ? (fecha.getMonth() + 1) === parseInt(filters.mes) : true;
            const anioMatch = filters.anio ? fecha.getFullYear() === parseInt(filters.anio) : true;
            return mesMatch && anioMatch;
        });
        setFilteredRecibos(filtered);
    }, [filters, recibos]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prevFilters => ({ ...prevFilters, [name]: value }));
    };

    return (
        <div className="p-4 sm:p-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
                {/* Filtros */}
                <div className="p-6 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-800/50">
                    <div className="flex flex-wrap items-end gap-4">
                        <div className="w-32">
                            <label htmlFor="mes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Mes</label>
                            <select name="mes" id="mes" value={filters.mes} onChange={handleFilterChange}
                                className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 cursor-pointer transition-all duration-200 hover:border-red-500/50 text-sm py-2">
                                <option value="">Todos</option>
                                {meses.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
                            </select>
                        </div>
                        <div className="w-28">
                            <label htmlFor="anio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Año</label>
                            <select name="anio" id="anio" value={filters.anio} onChange={handleFilterChange}
                                className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 cursor-pointer transition-all duration-200 hover:border-red-500/50 text-sm py-2">
                                {availableYears.map(year => <option key={year} value={year}>{year}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Tabla de Recibos */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-700/50">
                            <tr className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                                <th className="px-6 py-4 text-left">Fecha de Emisión</th>
                                <th className="px-6 py-4 text-left hidden sm:table-cell">Período</th>
                                <th className="px-6 py-4 text-left">Archivos</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {filteredRecibos.length > 0 && filteredRecibos.map(recibo => (
                                <tr key={recibo.id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors duration-200">
                                    <td className="px-6 py-4 font-medium">{new Date(recibo.fecha_emision).toLocaleDateString('es-AR', { timeZone: 'UTC' })}</td>
                                    <td className="px-6 py-4 hidden sm:table-cell text-gray-600 dark:text-gray-400">{recibo.periodo}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {recibo.ruta_pdf && (
                                                <a href={recibo.ruta_pdf} target="_blank" rel="noreferrer"
                                                    className="flex items-center gap-2 px-3 py-1.5 text-sm text-red-600 hover:text-red-700 bg-red-50 dark:bg-red-900/20 rounded-lg transition-colors duration-200 hover:bg-red-100 dark:hover:bg-red-900/30">
                                                    <FileText className="w-4 h-4" />
                                                    <span>PDF</span>
                                                </a>
                                            )}
                                            {recibo.ruta_imagen && (
                                                <a href={recibo.ruta_imagen} target="_blank" rel="noreferrer"
                                                    className="flex items-center gap-2 px-3 py-1.5 text-sm text-blue-600 hover:text-blue-700 bg-blue-50 dark:bg-blue-900/20 rounded-lg transition-colors duration-200 hover:bg-blue-100 dark:hover:bg-blue-900/30">
                                                    <Image className="w-4 h-4" />
                                                    <span>Imagen</span>
                                                </a>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mensaje si no hay recibos */}
                {filteredRecibos.length === 0 && (
                    <div className="py-12 px-6">
                        <div className="max-w-sm mx-auto text-center">
                            <div className="inline-flex p-4 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
                                <Receipt className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                            </div>
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">No se encontraron recibos</h3>
                            <p className="text-sm text-gray-500">Prueba con otros filtros o revisa si tienes recibos cargados.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MisRecibos;
