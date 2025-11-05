import React from 'react';
import { CalendarClock, Clock, CalendarX } from 'lucide-react';

// Mock data - en una aplicación real, esto vendría de una API
const asignaciones = [
    {
        id: 1,
        id_horario: {
            nombre: 'Turno Mañana',
            hora_entrada: '08:00',
            hora_salida: '17:00',
            lunes: true,
            martes: true,
            miercoles: true,
            jueves: true,
            viernes: true,
            sabado: false,
            domingo: false,
        },
        estado: true, // Activo
        fecha_asignacion: '2023-01-15',
    },
    {
        id: 2,
        id_horario: {
            nombre: 'Turno Tarde',
            hora_entrada: '14:00',
            hora_salida: '23:00',
            lunes: true,
            martes: true,
            miercoles: true,
            jueves: true,
            viernes: true,
            sabado: false,
            domingo: false,
        },
        estado: false, // Inactivo
        fecha_asignacion: '2022-11-20',
    },
    {
        id: 3,
        id_horario: {
            nombre: 'Fin de Semana',
            hora_entrada: '10:00',
            hora_salida: '19:00',
            lunes: false,
            martes: false,
            miercoles: false,
            jueves: false,
            viernes: false,
            sabado: true,
            domingo: true,
        },
        estado: true, // Activo
        fecha_asignacion: '2023-05-10',
    },
];

const DayPill = ({ day, active }) => (
    <span className={`px-2 py-1 rounded-full font-medium transition-colors duration-200 text-xs ${active ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'}`}>
        {day}
    </span>
);

const MisHorarios = () => {
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString('es-AR', options);
    };

    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/20">
                        <CalendarClock className="h-5 w-5 text-red-600 dark:text-red-400" />
                    </span>
                    <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">Tus Horarios de Trabajo</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Aquí puedes ver todos tus horarios asignados.</p>
                    </div>
                </div>
            </div>

            {asignaciones && asignaciones.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {asignaciones.map((asignacion) => (
                        <div key={asignacion.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition-all duration-200">
                            <div className="flex justify-between items-start mb-3">
                                <h3 className="font-bold text-lg text-gray-900 dark:text-white">{asignacion.id_horario.nombre}</h3>
                                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${asignacion.estado ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'}`}>
                                    {asignacion.estado ? 'Activo' : 'Inactivo'}
                                </span>
                            </div>

                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                Asignado el: {formatDate(asignacion.fecha_asignacion)}
                            </p>

                            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 mb-4 text-center">
                                <div className="flex items-center justify-center gap-2">
                                    <Clock className="w-5 h-5 text-gray-400" />
                                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {asignacion.id_horario.hora_entrada} - {asignacion.id_horario.hora_salida}
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-wrap justify-center gap-2 text-xs">
                                <DayPill day="Lun" active={asignacion.id_horario.lunes} />
                                <DayPill day="Mar" active={asignacion.id_horario.martes} />
                                <DayPill day="Mié" active={asignacion.id_horario.miercoles} />
                                <DayPill day="Jue" active={asignacion.id_horario.jueves} />
                                <DayPill day="Vie" active={asignacion.id_horario.viernes} />
                                <DayPill day="Sáb" active={asignacion.id_horario.sabado} />
                                <DayPill day="Dom" active={asignacion.id_horario.domingo} />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="mx-auto h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
                        <CalendarX className="h-6 w-6 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">No tienes horarios asignados</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Aún no se te ha asignado ningún horario de trabajo.</p>
                </div>
            )}
        </div>
    );
};

export default MisHorarios;