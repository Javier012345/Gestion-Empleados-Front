import React from 'react';
import { Plus, Filter, RotateCw, Link, ArrowRight, ShieldOff } from 'lucide-react';

const Sanciones = () => {
    const sanciones = [
        {
            id: 1,
            nombre: 'Amonestación por Retraso',
            tipo: 'Leve',
            motivo: 'Llegada tarde injustificada de 15 minutos.',
            incidente_asociado: true,
            empleado: { nombre: 'Juan', apellido: 'Perez', iniciales: 'JP', foto: null },
            fecha_inicio: '15/10/2025'
        },
        {
            id: 2,
            nombre: 'Suspensión por Ausencia',
            tipo: 'Grave',
            motivo: 'Falta injustificada al trabajo durante un día completo.',
            incidente_asociado: false,
            empleado: { nombre: 'Maria', apellido: 'Gomez', iniciales: 'MG', foto: null },
            fecha_inicio: '12/10/2025'
        },
        {
            id: 3,
            nombre: 'Llamada de Atención',
            tipo: 'Moderada',
            motivo: 'Incumplimiento de las normas de vestimenta de la empresa.',
            incidente_asociado: true,
            empleado: { nombre: 'Carlos', apellido: 'Lopez', iniciales: 'CL', foto: null },
            fecha_inicio: '10/10/2025'
        },
    ];

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Sanciones</h1>
                <a href="/sanciones/agregar" className="w-full sm:w-auto flex-shrink-0 bg-red-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-red-700">
                    <Plus size={20} />
                    <span>Aplicar Sanción Directa</span>
                </a>
            </div>

            <form className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 items-end">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Buscar por Empleado</label>
                        <input type="text" placeholder="Nombre o DNI..." className="mt-1 w-full pl-4 pr-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white" />
                    </div>
                    <div>
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
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tipo</label>
                        <select className="mt-1 w-full pl-4 pr-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white">
                            <option value="">Todos</option>
                            <option value="Leve">Leve</option>
                            <option value="Moderada">Moderada</option>
                            <option value="Grave">Grave</option>
                        </select>
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Registros</label>
                        <select className="w-full mt-1 px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 focus:ring-red-500 focus:border-red-500 text-gray-900 dark:text-white">
                            <option value="9">9</option>
                            <option value="12">12</option>
                            <option value="18">18</option>
                        </select>
                    </div>
                    <div className="flex gap-2 ">
                        <button type="submit" className="w-full bg-red-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-red-700">
                            <Filter size={16} /><span>Filtrar</span>
                        </button>
                        <a href="/sanciones" className="w-full bg-gray-300 text-gray-800 px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-400 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">
                            <RotateCw size={16} /><span>Limpiar</span>
                        </a>
                    </div>
                </div>
            </form>

            {sanciones.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sanciones.map(sancion => (
                        <div key={sancion.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 flex flex-col border dark:border-gray-700 group hover:shadow-xl hover:border-red-500/20 transition-all duration-300 hover:-translate-y-1">
                            <div className="flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                                        {sancion.nombre}
                                    </h3>
                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${sancion.tipo === 'Leve' ? 'text-green-800 bg-green-100 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800' : sancion.tipo === 'Moderada' ? 'text-yellow-800 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800' : 'text-red-800 bg-red-100 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800'}`}>
                                        {sancion.tipo}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{sancion.motivo}</p>
                                {sancion.incidente_asociado && (
                                    <div className="mb-4">
                                        <a href="#" className="inline-flex items-center gap-2 text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                                            <Link size={16} />
                                            <span>Ver Incidente Vinculado</span>
                                        </a>
                                    </div>
                                )}
                            </div>
                            <div className="border-t dark:border-gray-700 pt-4">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Sancionado:</span>
                                        <div className="flex -space-x-2 mt-2">
                                            <span className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-gray-800 bg-gray-200 dark:bg-gray-700 flex items-center justify-center font-bold text-gray-500 text-xs" title={`${sancion.empleado.nombre} ${sancion.empleado.apellido}`}>
                                                {sancion.empleado.iniciales}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{sancion.fecha_inicio}</span>
                                        <a href={`/sanciones/${sancion.id}`} className="block mt-2 text-sm font-semibold text-red-600 hover:text-red-800 dark:hover:text-red-400">Ver Detalle <ArrowRight className="inline-block h-4 w-4" /></a>
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