import React, { useState, useEffect } from 'react';
import { Plus, Filter, RotateCw, Link as LinkIcon, ArrowRight, ShieldOff, Loader } from 'lucide-react';
import { getSancionesEmpleados } from '../../services/api';
import { Link } from 'react-router-dom';

const Sanciones = () => {
    const [sanciones, setSanciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        searchQuery: '',
        mes: '',
        anio: '',
        tipo: ''
    });

    useEffect(() => {
        const fetchSanciones = async () => {
            try {
                setLoading(true);
                const response = await getSancionesEmpleados();
                setSanciones(response.data);
            } catch (err) {
                setError('No se pudieron cargar las sanciones. Inténtalo de nuevo más tarde.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchSanciones();
    }, []);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        // Validación para el campo de búsqueda
        if (name === 'searchQuery') {
            if (/^[a-zA-Z\s\u00C0-\u017F0-9]*$/.test(value)) {
                setFilters(prev => ({ ...prev, [name]: value }));
            }
        } else {
            setFilters(prev => ({ ...prev, [name]: value }));
        }
    };

    const resetFilters = () => {
        setFilters({
            searchQuery: '',
            mes: '',
            anio: '',
            tipo: ''
        });
    };

    const filteredSanciones = sanciones.filter(sancion => {
        const searchLower = filters.searchQuery.toLowerCase();
        const empleado = sancion.id_empl;
        const fullName = `${empleado.nombre} ${empleado.apellido}`.toLowerCase();
        const dni = String(empleado.dni);

        const searchMatch = fullName.includes(searchLower) || dni.includes(searchLower);
        
        const fechaSancion = new Date(sancion.fecha_inicio);
        const mesMatch = filters.mes ? (fechaSancion.getUTCMonth() + 1) === parseInt(filters.mes) : true;
        const anioMatch = filters.anio ? fechaSancion.getUTCFullYear() === parseInt(filters.anio) : true;

        const tipoMatch = filters.tipo ? sancion.id_sancion.tipo === filters.tipo : true;

        return searchMatch && mesMatch && anioMatch && tipoMatch;
    });

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex justify-end mb-4">
                <a href="/sanciones/agregar" className="w-full sm:w-auto flex-shrink-0 bg-red-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-red-700 font-medium transition-all duration-200 hover:shadow-lg hover:scale-105">
                    <Plus size={20} />
                    <span>Aplicar Sanción Directa</span>
                </a>
            </div>

            <form className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-6 border border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 items-end">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Buscar por Empleado</label>
                        <input 
                            type="text" 
                            name="searchQuery"
                            placeholder="Nombre o DNI..." 
                            value={filters.searchQuery}
                            onChange={handleFilterChange}
                            className="mt-1 w-full pl-4 pr-4 py-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white" 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Periodo</label>
                        <div className="flex gap-2 mt-1">
                            <select name="mes" value={filters.mes} onChange={handleFilterChange} className="w-full pl-4 pr-4 py-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                                <option value="">Mes</option>
                                {[...Array(12).keys()].map(i => <option key={i+1} value={i+1}>{new Date(0, i).toLocaleString('es-ES', { month: 'long' })}</option>)}
                            </select>
                            <select name="anio" value={filters.anio} onChange={handleFilterChange} className="w-full pl-4 pr-4 py-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                                <option value="">Año</option>
                                {[2023, 2024, 2025].map(year => <option key={year} value={year}>{year}</option>)}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tipo</label>
                        <select name="tipo" value={filters.tipo} onChange={handleFilterChange} className="mt-1 w-full pl-4 pr-4 py-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                            <option value="">Todos</option>
                            <option value="Leve">Leve</option>
                            <option value="Moderada">Moderada</option>
                            <option value="Grave">Grave</option>
                        </select>
                    </div>
                    <div className="flex gap-2">
                        <button type="button" onClick={resetFilters} className="w-full bg-gray-300 text-gray-800 px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-400 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">
                            <RotateCw size={16} /><span>Limpiar</span>
                        </button>
                    </div>
                </div>
            </form>

            {loading ? (
                <div className="flex justify-center items-center py-10">
                    <Loader className="animate-spin text-red-600" size={40} />
                </div>
            ) : error ? (
                <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                    <ShieldOff className="mx-auto h-12 w-12 text-red-400" />
                    <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">Error al cargar</h3>
                    <p className="mt-1 text-sm text-gray-500">{error}</p>
                </div>
            ) : filteredSanciones.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredSanciones.map(sancion => (
                        <div key={sancion.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 flex flex-col border dark:border-gray-700 group hover:shadow-xl hover:border-red-500/20 transition-all duration-300 hover:-translate-y-1">
                            <div className="flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                                        {sancion.id_sancion.nombre}
                                    </h3>
                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${sancion.id_sancion.tipo === 'Leve' ? 'text-green-800 bg-green-100 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800' : sancion.id_sancion.tipo === 'Moderada' ? 'text-yellow-800 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800' : 'text-red-800 bg-red-100 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800'}`}>
                                        {sancion.id_sancion.tipo}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{sancion.motivo}</p>
                                {!!sancion.incidente_asociado && (
                                    <div className="mb-4">
                                        <Link to={`/incidentes/${sancion.incidente_asociado}`} className="inline-flex items-center gap-2 text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                                            <LinkIcon size={16} />
                                            <span>Ver Incidente Vinculado</span>
                                        </Link>
                                    </div>
                                )}
                            </div>
                            <div className="border-t dark:border-gray-700 pt-4">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Sancionado</span>
                                        <div className="flex -space-x-2 mt-2">
                                            <span className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-gray-800 bg-gray-200 dark:bg-gray-700 flex items-center justify-center font-bold text-gray-500 text-xs" title={`${sancion.id_empl.nombre} ${sancion.id_empl.apellido}`}>
                                                {sancion.id_empl.nombre[0]}{sancion.id_empl.apellido[0]}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{new Date(sancion.fecha_inicio).toLocaleDateString('es-ES')}</span>
                                        <Link to={`/sanciones/${sancion.id}`} className="block mt-2 text-sm font-semibold text-red-600 hover:text-red-800 dark:hover:text-red-400">Ver Detalle <ArrowRight className="inline-block h-4 w-4" /></Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                    <ShieldOff className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">No se encontraron sanciones</h3>
                    <p className="mt-1 text-sm text-gray-500">No se han encontrado sanciones con los filtros aplicados.</p>
                </div>
            )}
        </div>
    );
};

export default Sanciones;