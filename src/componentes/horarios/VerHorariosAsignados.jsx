import React from 'react';
import { Users, User, ChevronDown } from 'lucide-react';

const VerHorariosAsignados = () => {
    const horarios = [
        {
            nombre: 'Turno Mañana',
            hora_entrada: '08:00',
            hora_salida: '16:00',
            dias: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie'],
            personal_asignado: 2,
            cantidad_personal_requerida: 3,
            asignaciones: [
                { id_empl: { nombre: 'Juan', apellido: 'Perez', dni: '12345678' } },
                { id_empl: { nombre: 'Maria', apellido: 'Gomez', dni: '87654321' } },
            ]
        },
        {
            nombre: 'Turno Tarde',
            hora_entrada: '16:00',
            hora_salida: '00:00',
            dias: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie'],
            personal_asignado: 1,
            cantidad_personal_requerida: 2,
            asignaciones: [
                { id_empl: { nombre: 'Carlos', apellido: 'Lopez', dni: '11223344' } },
            ]
        },
        {
            nombre: 'Fin de Semana',
            hora_entrada: '09:00',
            hora_salida: '17:00',
            dias: ['Sáb', 'Dom'],
            personal_asignado: 0,
            cantidad_personal_requerida: 2,
            asignaciones: []
        },
    ];

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Horarios y Personal Asignado</h3>
                <div className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-lg">
                    <Users className="w-4 h-4 mr-2" />
                    <span>Total asignados: {horarios.length}</span>
                </div>
            </div>

            {horarios.map((horario, index) => (
                <details key={index} className="group bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 hover:shadow-md transition-all duration-200">
                    <summary className="flex flex-col gap-y-2 sm:flex-row sm:justify-between sm:items-center font-medium cursor-pointer list-none">
                        <div>
                            <h4 className="font-bold text-gray-900 dark:text-white">{horario.nombre}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {horario.hora_entrada} - {horario.hora_salida}
                            </p>
                            <div className="text-xs text-gray-500 mt-1 flex gap-2">
                                {horario.dias.map(dia => <span key={dia}>{dia}</span>)}
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                {horario.personal_asignado} / {horario.cantidad_personal_requerida} Asignados
                            </span>
                            <span className="transition group-open:rotate-180">
                                <ChevronDown className="w-5 h-5" />
                            </span>
                        </div>
                    </summary>
                    <div className="mt-4 border-t pt-4 dark:border-gray-600">
                        {horario.asignaciones.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                {horario.asignaciones.map((asignacion, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 rounded-md bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-200">
                                        <div className="h-8 w-8 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center text-red-600 dark:text-red-400">
                                            <User className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm text-gray-900 dark:text-white">{asignacion.id_empl.nombre} {asignacion.id_empl.apellido}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">DNI: {asignacion.id_empl.dni}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-6">
                                <div className="mx-auto h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-3">
                                    <Users className="w-6 h-6 text-gray-400" />
                                </div>
                                <p className="text-sm text-gray-500">No hay empleados asignados a este horario.</p>
                            </div>
                        )}
                    </div>
                </details>
            ))}
        </div>
    );
};

export default VerHorariosAsignados;