import React, { useState, useEffect } from 'react';
import { CalendarClock, Clock, CalendarX, Loader, AlertTriangle } from 'lucide-react';
import { getMisHorarios } from '../../services/api';

const DayPill = ({ day, active }) => (
    <span className={`px-2 py-1 rounded-full font-medium transition-colors duration-200 text-xs ${active ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'}`}>
        {day}
    </span>
);

const MisHorarios = () => {
    const [asignaciones, setAsignaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHorarios = async () => {
            try {
                setLoading(true);
                const response = await getMisHorarios();
                setAsignaciones(response.data);
                setError(null);
            } catch (err) {
                setError("No se pudieron cargar tus horarios.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchHorarios();
    }, []);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'UTC' };
        return new Date(dateString).toLocaleDateString('es-AR', options);
    };

    const formatTime = (timeString) => {
        if (!timeString) return '';
        // Asume que el formato es HH:MM:SS.msZ y solo queremos HH:MM
        return timeString.substring(0, 5);
    };

    if (loading) {
        return <div className="flex justify-center items-center p-8"><Loader className="animate-spin mr-2" /> Cargando tus horarios...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center p-8 text-red-500"><AlertTriangle className="mr-2" /> {error}</div>;
    }

    return (
        <div className="space-y-6 text-gray-900 dark:text-gray-100">
            <div className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800/50 rounded-xl border border-gray-300 dark:border-gray-700 p-6">
                <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/20">
                        <CalendarClock className="h-5 w-5 text-red-600 dark:text-red-400" />
                    </span>
                    <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">Tus Horarios de Trabajo</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Aquí puedes ver todos tus horarios asignados.</p>
                    </div>
                </div>
            </div>

            {asignaciones && asignaciones.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {asignaciones.map((asignacion) => (
                        <div key={asignacion.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-300 dark:border-gray-700 p-5 hover:shadow-lg hover:border-red-300 dark:hover:border-red-700 transition-all duration-300">
                            <div className="flex justify-between items-start mb-3">                                <h3 className="font-bold text-lg text-gray-900 dark:text-white">{asignacion.nombre}</h3>
                                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${asignacion.estado ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'}`}>
                                    {asignacion.estado ? 'Activo' : 'Inactivo'}
                                </span>
                            </div>

                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                Asignado el: {formatDate(asignacion.fecha_asignacion)}                             </p>

                            <div className="bg-gray-100 dark:bg-gray-700/50 rounded-lg p-3 mb-4 text-center border border-gray-200 dark:border-gray-600">
                                <div className="flex items-center justify-center gap-2">
                                    <Clock className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {formatTime(asignacion.hora_entrada)} - {formatTime(asignacion.hora_salida)}
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-wrap justify-center gap-2 text-xs">
                                <DayPill day="Lun" active={asignacion.lunes} />
                                <DayPill day="Mar" active={asignacion.martes} />
                                <DayPill day="Mié" active={asignacion.miercoles} />
                                <DayPill day="Jue" active={asignacion.jueves} />
                                <DayPill day="Vie" active={asignacion.viernes} />
                                <DayPill day="Sáb" active={asignacion.sabado} />
                                <DayPill day="Dom" active={asignacion.domingo} />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-300 dark:border-gray-700">
                    <div className="mx-auto h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
                        <CalendarX className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">No tienes horarios asignados</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Aún no se te ha asignado ningún horario de trabajo.</p>
                </div>
            )}
        </div>
    );
};

export default MisHorarios;