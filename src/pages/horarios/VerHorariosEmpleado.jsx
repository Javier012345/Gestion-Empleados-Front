import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getHorariosByEmpleadoId, getEmpleadoById } from '../../services/api';
import { Loader, AlertTriangle, ArrowLeft, Clock, CalendarX } from 'lucide-react';

const DayPill = ({ day, active }) => (
    <span className={`px-2 py-1 rounded-full font-medium transition-colors duration-200 text-xs ${active ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'}`}>
        {day}
    </span>
);

const VerHorariosEmpleado = () => {
    const { id } = useParams();
    const [horarios, setHorarios] = useState([]);
    const [empleado, setEmpleado] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [horariosRes, empleadoRes] = await Promise.all([
                    getHorariosByEmpleadoId(id),
                    getEmpleadoById(id)
                ]);
                setHorarios(horariosRes.data);
                setEmpleado(empleadoRes.data);
                setError(null);
            } catch (err) {
                setError("No se pudieron cargar los horarios para este empleado.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const formatTime = (timeString) => timeString ? timeString.substring(0, 5) : '';

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
                Horarios de {empleado?.nombre} {empleado?.apellido}
            </h2>

            {horarios.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {horarios.map((horario) => (
                        <div key={horario.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-300 dark:border-gray-700 p-5 hover:shadow-lg hover:border-red-300 dark:hover:border-red-700 transition-all duration-300">
                            <div className="flex justify-between items-start mb-3">
                                <h3 className="font-bold text-lg text-gray-900 dark:text-white">{horario.nombre}</h3>
                                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                                    Activo
                                </span>
                            </div>
                            <div className="bg-gray-100 dark:bg-gray-700/50 rounded-lg p-3 mb-4 text-center border border-gray-200 dark:border-gray-600">
                                <div className="flex items-center justify-center gap-2">
                                    <Clock className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatTime(horario.hora_entrada)} - {formatTime(horario.hora_salida)}</p>
                                </div>
                            </div>
                            <div className="flex flex-wrap justify-center gap-2 text-xs">
                                {['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'].map(dia => <DayPill key={dia} day={dia.charAt(0).toUpperCase() + dia.slice(1, 3)} active={horario[dia]} />)}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-300 dark:border-gray-700">
                    <div className="mx-auto h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4"><CalendarX className="h-6 w-6 text-gray-500 dark:text-gray-400" /></div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Sin Horarios Asignados</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Este empleado no tiene horarios de trabajo asignados actualmente.</p>
                </div>
            )}
        </div>
    );
};

export default VerHorariosEmpleado;
