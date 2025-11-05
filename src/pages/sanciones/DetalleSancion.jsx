import React from 'react';
import { ArrowLeft, Printer, User, AlertTriangle, ArrowRight } from 'lucide-react';
import { useParams, Link } from 'react-router-dom';

const DetalleSancion = () => {
    const { id } = useParams();

    // Dummy data, replace with API call
    const sancion = {
        id: id,
        nombre: 'Suspensión por Ausencia',
        tipo: 'Grave',
        activa: true,
        empleado: { nombre: 'Maria', apellido: 'Gomez', dni: '87654321' },
        fecha_inicio: '12/10/2025',
        fecha_fin: '13/10/2025',
        motivo: 'Falta injustificada al trabajo durante un día completo.',
        incidente_asociado: {
            id: 101,
            tipo: 'Ausencia Injustificada',
            fecha_ocurrencia: '12/10/2025'
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <Link to="/sanciones" className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500 mb-6">
                <ArrowLeft size={16} /> Volver
            </Link>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
                            {sancion.nombre}
                        </h2>
                        <div className="flex items-center gap-3">
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${sancion.tipo === 'Leve' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800' : sancion.tipo === 'Moderada' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800' : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800'}`}>
                                {sancion.tipo}
                            </span>
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${sancion.activa ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'}`}>
                                {sancion.activa ? 'Activa' : 'Finalizada'}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <a href={`/sanciones/pdf/${sancion.id}`} target="_blank" className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-200 hover:shadow-lg hover:scale-105">
                            <Printer size={16} />
                            <span>Imprimir</span>
                        </a>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                            <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">Información del Empleado</h4>
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                                    <User size={24} className="text-red-600 dark:text-red-400" />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 dark:text-white">{sancion.empleado.nombre} {sancion.empleado.apellido}</p>
                                    <p className="text-sm text-gray-500">DNI: {sancion.empleado.dni}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                            <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">Detalles de la Sanción</h4>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Período</p>
                                    <p className="font-medium text-gray-900 dark:text-white">{sancion.fecha_inicio} {sancion.fecha_fin && `al ${sancion.fecha_fin}`}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Motivo</p>
                                    <p className="font-medium text-gray-900 dark:text-white">{sancion.motivo}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {sancion.incidente_asociado && (
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                            <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">Incidente Vinculado</h4>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                                        <AlertTriangle size={24} className="text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 dark:text-white">{sancion.incidente_asociado.tipo}</p>
                                        <p className="text-sm text-gray-500">{sancion.incidente_asociado.fecha_ocurrencia}</p>
                                    </div>
                                </div>
                                <Link to={`/incidentes/${sancion.incidente_asociado.id}`} className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
                                    <span>Ver Detalles del Incidente</span>
                                    <ArrowRight size={16} />
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DetalleSancion;