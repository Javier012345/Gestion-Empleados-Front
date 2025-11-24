import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getIncidentesByEmpleadoId, getEmpleadoById } from '../../services/api';
import { Loader, AlertTriangle, ArrowLeft, Filter, RotateCw, ArrowRight } from 'lucide-react';

const VerIncidentesEmpleado = () => {
    const { id } = useParams();
    const [incidentes, setIncidentes] = useState([]);
    const [empleado, setEmpleado] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filteredIncidentes, setFilteredIncidentes] = useState([]);
    const [filters, setFilters] = useState({ month: '', year: '', status: '' });

    const availableYears = useMemo(() => [...new Set(incidentes.map(inc => new Date(inc.fecha_ocurrencia).getFullYear()))].sort((a, b) => b - a), [incidentes]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [incidentesRes, empleadoRes] = await Promise.all([
                    getIncidentesByEmpleadoId(id),
                    getEmpleadoById(id)
                ]);
                setIncidentes(incidentesRes.data);
                setFilteredIncidentes(incidentesRes.data);
                setEmpleado(empleadoRes.data);
                setError(null);
            } catch (err) {
                setError("No se pudieron cargar los incidentes para este empleado.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    useEffect(() => {
        const applyFilters = () => {
            const filtered = incidentes.filter(inc => {
                const fecha = new Date(inc.fecha_ocurrencia);
                const monthMatch = filters.month ? (fecha.getUTCMonth() + 1) === parseInt(filters.month) : true;
                const yearMatch = filters.year ? fecha.getUTCFullYear() === parseInt(filters.year) : true;
                const statusMatch = filters.status ? inc.estado === filters.status : true;
                return monthMatch && yearMatch && statusMatch;
            });
            setFilteredIncidentes(filtered);
        };
        applyFilters();
    }, [filters, incidentes]);

    const handleFilterChange = (e) => {
        setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const clearFilters = () => {
        setFilters({ month: '', year: '', status: '' });
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
                Incidentes de {empleado?.nombre} {empleado?.apellido}
            </h2>

            <form className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-6 border border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 items-end">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Periodo</label>
                        <div className="flex items-center gap-2">
                            <select name="month" value={filters.month} onChange={handleFilterChange} className="w-full pl-4 pr-4 py-2 rounded-lg border bg-white border-gray-300 text-gray-900 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                <option value="">Mes</option>
                                {[...Array(12).keys()].map(i => <option key={i+1} value={i+1}>{new Date(0, i).toLocaleString('es-ES', { month: 'long' })}</option>)}
                            </select>
                            <select name="year" value={filters.year} onChange={handleFilterChange} className="w-full pl-4 pr-4 py-2 rounded-lg border bg-white border-gray-300 text-gray-900 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                <option value="">Año</option>
                                {availableYears.map(year => <option key={year} value={year}>{year}</option>)}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Estado</label>
                        <select name="status" value={filters.status} onChange={handleFilterChange} className="mt-1 w-full pl-4 pr-4 py-2 rounded-lg border bg-white border-gray-300 text-gray-900 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                            <option value="">Todos</option>
                            <option value="ABIERTO">Abierto</option>
                            <option value="CERRADO">Cerrado</option>
                        </select>
                    </div>
                    <div className="flex gap-2 md:col-span-2">
                        <button type="button" onClick={clearFilters} className="w-full bg-gray-300 text-gray-800 px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-400 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">
                            <RotateCw size={16} /><span>Limpiar</span>
                        </button>
                    </div>
                </div>
            </form>

            {filteredIncidentes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredIncidentes.map(incidente => (
                        <div key={incidente.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 flex flex-col border dark:border-gray-700 hover:shadow-xl hover:border-red-500/20 transition-all duration-300 group">
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-lg text-gray-800 dark:text-white group-hover:text-red-600">{incidente.id_incidente.tipo_incid}</h3>
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${incidente.estado === 'ABIERTO' ? 'text-yellow-800 bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-300' : 'text-green-800 bg-green-200 dark:bg-green-900 dark:text-green-300'}`}>
                                        {incidente.estado === 'ABIERTO' ? 'Abierto' : 'Cerrado'}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{incidente.descripcion}</p>
                            </div>
                            <div className="border-t dark:border-gray-700 pt-4 flex justify-between items-center">
                                <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(incidente.fecha_ocurrencia).toLocaleDateString('es-AR', { timeZone: 'UTC' })}</p>
                                <Link to={`/incidentes/${incidente.grupo_incidente}`} className="text-sm font-semibold text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 flex items-center gap-2 group">
                                    <span>Ver Detalle</span>
                                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="mx-auto h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4"><AlertTriangle className="h-6 w-6 text-gray-400" /></div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Sin Incidentes</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{incidentes.length > 0 ? 'No hay incidentes que coincidan con los filtros.' : 'Este empleado no tiene incidentes registrados.'}</p>
                </div>
            )}
        </div>
    );
};

export default VerIncidentesEmpleado;