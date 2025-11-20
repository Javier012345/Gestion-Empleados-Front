import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMisNotificaciones } from '../../services/api';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Bell, CheckCircle, Mail } from 'lucide-react';

const Notificaciones = () => {
    const [notificaciones, setNotificaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNotificaciones = async () => {
            try {
                setLoading(true);
                const response = await getMisNotificaciones();
                const sortedNotificaciones = response.data.sort((a, b) => new Date(b.fecha_creacion) - new Date(a.fecha_creacion));
                setNotificaciones(sortedNotificaciones);
                setError(null);
            } catch (err) {
                console.error("Error al obtener las notificaciones:", err);
                setError("No se pudieron cargar las notificaciones. Inténtelo de nuevo más tarde.");
            } finally {
                setLoading(false);
            }
        };

        fetchNotificaciones();
    }, []);

    const getIconoNotificacion = (notificacion) => {
        if (notificacion.leida) {
            return <CheckCircle className="text-gray-400 w-5 h-5" />;
        }
        return <Bell className="text-red-500 w-5 h-5" />;
    };

    if (loading) {
        return <div className="p-8 text-center text-gray-500 dark:text-gray-400">Cargando notificaciones...</div>;
    }

    if (error) {
        return <div className="p-8 text-center text-red-500">{error}</div>;
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Centro de Notificaciones</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Aquí encontrarás todas tus alertas y avisos.</p>
                </div>
                
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {notificaciones.length > 0 ? (
                        notificaciones.map(notif => (
                            <Link to={notif.enlace || '#'} key={notif.id} className="flex items-start gap-4 p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
                                <div className={`mt-1 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${!notif.leida ? 'bg-red-100 dark:bg-red-900/50' : 'bg-gray-100 dark:bg-gray-700'}`}>
                                    {getIconoNotificacion(notif)}
                                </div>
                                <div className="flex-1">
                                    <p className={`text-sm ${!notif.leida ? 'font-semibold text-gray-800 dark:text-gray-100' : 'text-gray-600 dark:text-gray-300'}`}>{notif.mensaje}</p>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                        {formatDistanceToNow(new Date(notif.fecha_creacion), { addSuffix: true, locale: es })}
                                    </span>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <p className="p-8 text-center text-gray-500 dark:text-gray-400">No tienes notificaciones.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Notificaciones;