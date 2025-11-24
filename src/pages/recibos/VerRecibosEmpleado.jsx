import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getRecibosByEmpleadoId, getEmpleadoById } from '../../services/api';
import { Filter, FileText, Image, Receipt, Loader, AlertCircle, ArrowLeft } from 'lucide-react';

const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

const VerRecibosEmpleado = () => {
    const { id } = useParams();
    const [recibos, setRecibos] = useState([]);
    const [empleado, setEmpleado] = useState(null);
    const [filteredRecibos, setFilteredRecibos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedFilters, setSelectedFilters] = useState({ mes: '', anio: '' });
    const [activeFilters, setActiveFilters] = useState({ mes: '', anio: '' });
    const [availableYears, setAvailableYears] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [recibosRes, empleadoRes] = await Promise.all([
                    getRecibosByEmpleadoId(id),
                    getEmpleadoById(id)
                ]);

                const recibosData = Array.isArray(recibosRes.data) ? recibosRes.data : [];
                setRecibos(recibosData);
                setEmpleado(empleadoRes.data);

                if (recibosData.length > 0) {
                    const years = [...new Set(recibosData.map(r => new Date(r.fecha_emision).getFullYear()))];
                    const sortedYears = years.sort((a, b) => b - a);
                    setAvailableYears(sortedYears);
                    if (sortedYears.length > 0) {
                        const latestYear = sortedYears[0].toString();
                        setSelectedFilters({ mes: '', anio: latestYear });
                        setActiveFilters({ mes: '', anio: latestYear });
                    }
                }
                setError(null);
            } catch (err) {
                setError("No se pudieron cargar los recibos para este empleado.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    useEffect(() => {
        if (loading) return;
        const filtered = recibos.filter(r => {
            const fecha = new Date(r.fecha_emision);
            const mesMatch = activeFilters.mes ? (fecha.getMonth() + 1) === parseInt(activeFilters.mes) : true;
            const anioMatch = activeFilters.anio ? fecha.getFullYear() === parseInt(activeFilters.anio) : true;
            return mesMatch && anioMatch;
        });
        setFilteredRecibos(filtered);
    }, [activeFilters, recibos, loading]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setSelectedFilters(prevFilters => ({ ...prevFilters, [name]: value }));
    };
    const handleFilterSubmit = (e) => {
        e.preventDefault();
        setActiveFilters(selectedFilters);
    };

    if (loading) {
        return <div className="flex justify-center items-center p-10"><Loader className="animate-spin text-red-600" size={48} /></div>;
    }

    if (error) {
        return <div className="p-6 text-center text-red-500">{error}</div>;
    }

    return (
        <div className="max-w-7xl mx-auto">
            <Link to={`/empleados/${id}`} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500 mb-4">
                <ArrowLeft size={16} /> Volver al Perfil del Empleado
            </Link>
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                Recibos de {empleado?.nombre} {empleado?.apellido}
            </h2>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
                {/* Filtros */}
                <div className="p-6 bg-gray-50 dark:bg-gray-800/50">
                    <form onSubmit={handleFilterSubmit} className="flex flex-wrap items-end gap-4">
                        <div className="w-32">
                            <label htmlFor="mes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Mes</label>
                            <select name="mes" id="mes" value={selectedFilters.mes} onChange={handleFilterChange}
                                className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 cursor-pointer transition-all duration-200 hover:border-red-500/50 text-sm py-2">
                                <option value="">Todos</option>
                                {meses.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
                            </select>
                        </div>
                        <div className="w-28">
                            <label htmlFor="anio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Año</label>
                            <select name="anio" id="anio" value={selectedFilters.anio} onChange={handleFilterChange}
                                className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 cursor-pointer transition-all duration-200 hover:border-red-500/50 text-sm py-2">
                                {availableYears.map(year => <option key={year} value={year}>{year}</option>)}
                            </select>
                        </div>
                        <button type="submit"
                            className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-all duration-200 flex items-center gap-2">
                            <Filter size={16} />
                            <span>Filtrar</span>
                        </button>
                    </form>
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
                            {filteredRecibos.length > 0 ? filteredRecibos.map(recibo => (
                                <tr key={recibo.id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors duration-200">
                                    <td className="px-6 py-4 font-medium text-gray-800 dark:text-gray-200">{new Date(recibo.fecha_emision).toLocaleDateString('es-AR', { timeZone: 'UTC' })}</td>
                                    <td className="px-6 py-4 hidden sm:table-cell text-gray-600 dark:text-gray-400">{recibo.periodo}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {recibo.ruta_pdf && (
                                                <a href={recibo.ruta_pdf} target="_blank" rel="noreferrer"
                                                    className="flex items-center gap-2 px-3 py-1.5 text-sm text-red-600 hover:text-red-700 bg-red-50 dark:bg-red-900/20 rounded-lg transition-colors duration-200 hover:bg-red-100 dark:hover:bg-red-900/30 dark:text-red-300 dark:hover:text-red-200">
                                                    <FileText className="w-4 h-4" />
                                                    <span>PDF</span>
                                                </a>
                                            )}
                                            {recibo.ruta_imagen && (
                                                <a href={recibo.ruta_imagen} target="_blank" rel="noreferrer"
                                                    className="flex items-center gap-2 px-3 py-1.5 text-sm text-blue-600 hover:text-blue-700 bg-blue-50 dark:bg-blue-900/20 rounded-lg transition-colors duration-200 hover:bg-blue-100 dark:hover:bg-blue-900/30 dark:text-blue-300 dark:hover:text-blue-200">
                                                    <Image className="w-4 h-4" />
                                                    <span>Imagen</span>
                                                </a>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="3">
                                        <div className="py-12 px-6">
                                            <div className="max-w-sm mx-auto text-center">
                                                <div className="inline-flex p-4 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
                                                    <Receipt className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                                                </div>
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">No se encontraron recibos</h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Este empleado no tiene recibos que coincidan con los filtros aplicados.</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default VerRecibosEmpleado;