import React from 'react';
import { ShieldAlert, Filter, RotateCw, Calendar, CalendarCheck, ArrowRight, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const MisSanciones = () => {
    const sanciones = [
        {
            id: 1,
            nombre: 'Amonestación por Retraso',
            tipo: 'Leve',
            motivo: 'Llegada tarde injustificada de 15 minutos.',
            fecha_inicio: '15/10/2025',
            fecha_fin: null,
            activa: true,
        },
        {
            id: 2,
            nombre: 'Suspensión por Ausencia',
            tipo: 'Grave',
            motivo: 'Falta injustificada al trabajo durante un día completo.',
            fecha_inicio: '12/10/2025',
            fecha_fin: '13/10/2025',
            activa: false,
        },
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/20">
                        <ShieldAlert className="h-5 w-5 text-red-600 dark:text-red-400" />
                    </span>
                    <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">Mis Sanciones</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Historial de sanciones aplicadas a tu perfil</p>
                    </div>
                </div>
            </div>

            <form className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 items-end">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Periodo</label>
                        <div className="flex gap-2 mt-1">
                            <select className="w-full pl-4 pr-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white">
                                <option value="">Mes</option>
                                {[...Array(12).keys()].map(i => <option key={i+1} value={i+1}>{new Date(0, i).toLocaleString('es-ES', { month: 'long' })}</option>)}
                            </select>
                            <select className="w-full pl-4 pr-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white">
                                <option value="">Año</option>
                                {[2023, 2024, 2025].map(year => <option key={year} value={year}>{year}</option>)}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tipo de Sanción</label>
                        <select className="mt-1 w-full pl-4 pr-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white">
                            <option value="">Todos</option>
                            <option value="Leve">Leve</option>
                            <option value="Moderada">Moderada</option>
                            <option value="Grave">Grave</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Registros</label>
                        <select className="mt-1 w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 focus:ring-red-500 focus:border-red-500 text-gray-900 dark:text-white">
                            <option value="9">9</option>
                            <option value="12">12</option>
                            <option value="18">18</option>
                        </select>
                    </div>
                    <div className="flex gap-2 md:col-span-1">
                        <button type="submit" className="w-full bg-red-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-red-700">
                            <Filter size={16} /><span>Filtrar</span>
                        </button>
                        <Link to="/mis-sanciones" className="w-full bg-gray-300 text-gray-800 px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-400 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">
                            <RotateCw size={16} /><span>Limpiar</span>
                        </Link>
                    </div>
                </div>
            </form>

            {sanciones.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sanciones.map(sancion => (
                        <div key={sancion.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 flex flex-col border dark:border-gray-700 hover:shadow-xl hover:border-red-500/20 transition-all duration-300">
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-lg text-gray-800 dark:text-white group-hover:text-red-600">{sancion.nombre}</h3>
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${sancion.tipo === 'Leve' ? 'text-green-800 bg-green-200 dark:bg-green-900 dark:text-green-300' : sancion.tipo === 'Moderada' ? 'text-yellow-800 bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-300' : 'text-red-800 bg-red-200 dark:bg-red-900 dark:text-red-300'}`}>
                                        {sancion.tipo}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{sancion.motivo}</p>
                                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={16} />
                                        <span>{sancion.fecha_inicio}</span>
                                    </div>
                                    {sancion.fecha_fin && (
                                        <div className="flex items-center gap-2">
                                            <CalendarCheck size={16} />
                                            <span>{sancion.fecha_fin}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="border-t dark:border-gray-700 pt-4 flex justify-between items-center">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${sancion.activa ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'}`}>
                                    {sancion.activa ? 'Activa' : 'Finalizada'}
                                </span>
                                <Link to={`/sanciones/${sancion.id}`} className="text-sm font-semibold text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 flex items-center gap-2 group">
                                    <span>Ver Detalle</span>
                                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                    <div className="mx-auto h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
                        <Shield className="h-6 w-6 text-gray-400" />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">No tienes sanciones</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">No se encontraron sanciones registradas.</p>
                </div>
            )}
        </div>
    );
};

export default MisSanciones;