import React, { useState, useEffect } from 'react';
import { Users, User, ChevronDown, AlertTriangle, Loader } from 'lucide-react';
import { getHorarios } from '../../services/api';

const VerHorariosAsignados = () => {
    const [horarios, setHorarios] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchHorarios = async () => {
            try {
                setIsLoading(true);
                const response = await getHorarios();
                setHorarios(response.data);
            } catch (err) {
                setError('No se pudieron cargar los horarios. Inténtalo de nuevo más tarde.');
                console.error("Error fetching schedules:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchHorarios();
    }, []);

    const diasSemana = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];

    if (isLoading) {
        return <div className="flex justify-center items-center p-8 text-gray-800 dark:text-gray-200"><Loader className="animate-spin mr-2" /> Cargando horarios...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center p-8 text-red-600 dark:text-red-400"><AlertTriangle className="mr-2" /> {error}</div>;
    }

    return (
        <div className="space-y-4 text-gray-900 dark:text-gray-100">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Horarios y Personal Asignado</h3>
                <div className="inline-flex items-center text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 px-3 py-1 rounded-lg">
                    <Users className="w-4 h-4 mr-2" />
                    <span>{horarios.length} Horarios Creados</span>
                </div>
            </div>

            {horarios.map((horario) => (
                <details key={horario.id} className="group bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-300 dark:border-gray-700 hover:shadow-md transition-all duration-200">
                    <summary className="flex flex-col gap-y-2 sm:flex-row sm:justify-between sm:items-center font-medium cursor-pointer list-none">
                        <div>
                            <h4 className="font-bold text-gray-900 dark:text-white">{horario.nombre}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {horario.hora_entrada.slice(0,5)} - {horario.hora_salida.slice(0,5)}
                            </p>
                            <div className="text-xs text-gray-500 mt-1 flex gap-2">
                                {diasSemana.map(dia => (
                                    horario[dia] && <span key={dia} className="capitalize bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 px-2 py-0.5 rounded-full">{dia.slice(0,3)}</span>
                                ))}
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                {horario.empleados_asignados.length} / {horario.cantidad_personal_requerida}
                                <span className="text-gray-500 dark:text-gray-400 font-normal ml-1">Asignados</span>
                            </span>
                            <span className="transition group-open:rotate-180 text-gray-500 dark:text-gray-400">
                                <ChevronDown className="w-5 h-5" />
                            </span>
                        </div>
                    </summary>
                    <div className="mt-4 border-t pt-4 border-gray-300 dark:border-gray-600">
                        {horario.empleados_asignados.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                {horario.empleados_asignados.map((empleado) => (
                                    <div key={empleado.id} className="flex items-center gap-3 p-3 rounded-md bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 hover:shadow-sm transition-all duration-200">
                                        <div className="h-8 w-8 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center text-red-600 dark:text-red-400">
                                            <User className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm text-gray-900 dark:text-white">{empleado.nombre} {empleado.apellido}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">DNI: {empleado.dni}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-6">
                                <div className="mx-auto h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-3">
                                    <Users className="w-6 h-6 text-gray-400" />
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">No hay empleados asignados a este horario.</p>
                            </div>
                        )}
                    </div>
                </details>
            ))}
        </div>
    );
};

export default VerHorariosAsignados;