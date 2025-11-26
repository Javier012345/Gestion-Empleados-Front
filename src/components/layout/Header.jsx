import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Sun, Moon, Bell, UserCog, User, Settings, LogOut } from 'lucide-react';
import { getMisNotificaciones, marcarNotificacionesLeidas } from '../../services/api';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import AlertDialog from './AlertDialog';
import { useAuth } from './AuthContext';



const Header = ({ 
    onOpenMobileMenu,
    theme,
    toggleTheme, 
    pageTitle
}) => {
    const { user, viewMode, toggleViewMode, logout } = useAuth();
    const navigate = useNavigate();
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [isAlertOpen, setAlertOpen] = useState(false); // Para el logout

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await getMisNotificaciones();
                console.log('Notificaciones recibidas:', response.data);
                setNotifications(response.data);
            } catch (error) {
                console.error("Error al obtener las notificaciones:", error);
            }
        };
        fetchNotifications();
    }, []); // Se ejecuta solo una vez al montar el componente

    const unreadNotificationsCount = notifications.filter(n => !n.leida).length;

    const handleMarkAllAsRead = async () => {
        try {
            await marcarNotificacionesLeidas();
            // Actualiza el estado local para reflejar que todas están leídas
            const updatedNotifications = notifications.map(n => ({ ...n, leida: true }));
            setNotifications(updatedNotifications);
            // Opcional: cerrar el dropdown de notificaciones
            setNotificationsOpen(false);
        } catch (error) {
            console.error("Error al marcar las notificaciones como leídas:", error);
            // Aquí podrías mostrar una notificación de error al usuario
        }
    };

    const handleNotificationClick = (enlace) => {
        if (enlace) {
            // Si estamos en modo admin, primero cambiamos a modo empleado.
            if (viewMode === 'admin') {
                toggleViewMode(); // Esto cambiará la vista a 'employee'.
            }
            // Cerramos el menú y navegamos al enlace correspondiente.
            setNotificationsOpen(false);
            navigate(enlace); // React Router se encargará de la navegación.
        }
    };
    const handleLogoutClick = () => {
        setProfileOpen(false); // Cierra el dropdown del perfil
        setAlertOpen(true);
    };

    const handleCloseAlert = () => {
        setAlertOpen(false);
    };

    const handleConfirmLogout = () => {
        logout();
    };

    if (!user) {
        return null; // O un spinner de carga mientras se obtienen los datos del usuario
    }

    return (
        <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 sm:px-6 flex-shrink-0">
            <div className="flex items-center gap-4">
<button onClick={onOpenMobileMenu} className="lg:hidden text-gray-600 dark:text-gray-300 p-2 rounded-lg">
                    <Menu size={20} />
                </button>
                <h1 className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
                    {pageTitle || 'Dashboard'}
                </h1>
            </div>

            <div className="flex items-center gap-3 sm:gap-4">
                <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors duration-200">
                    {theme === 'light' ? <Moon /> : <Sun />}
                </button>

                <div className="relative">
                    <button onClick={() => setNotificationsOpen(!notificationsOpen)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300">
                        <Bell size={20} />
                        {unreadNotificationsCount > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[10px] text-white font-medium items-center justify-center">
                                    {unreadNotificationsCount}
                                </span>
                            </span>
                        )}
                    </button>
                    {notificationsOpen && (
                        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border dark:border-gray-700 z-20">
                            <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
                                <h3 className="font-semibold text-gray-900 dark:text-white">Notificaciones ({unreadNotificationsCount})</h3>
                                <button onClick={handleMarkAllAsRead} className="text-sm text-red-600 hover:underline">Marcar como leídas</button>
                            </div>
                            <div className="max-h-96 overflow-y-auto divide-y dark:divide-gray-700">
                                {notifications.length > 0 ? notifications.map(notif => (
                                    <div 
                                        key={notif.id} 
                                        onClick={() => handleNotificationClick(notif.enlace)}
                                        className="block p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
                                    >
                                        <p className={`text-sm font-medium ${!notif.leida ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>{notif.mensaje}</p>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                            {formatDistanceToNow(new Date(notif.fecha_creacion), { addSuffix: true, locale: es })}
                                        </span>
                                    </div>
                                )) : (
                                    <p className="p-4 text-sm text-center text-gray-500 dark:text-gray-400">No tienes notificaciones nuevas.</p>
                                )}
                            </div>
                            <div className="p-2 bg-gray-50 dark:bg-gray-700/50 border-t dark:border-gray-700 text-center">
                                <Link to="/notificaciones" className="text-sm text-gray-600 dark:text-gray-300 hover:underline">Ver todas</Link>
                            </div>
                        </div>
                    )}
                </div>

                {/* Role Switcher */}
                {user.grupo !== 'Empleado' && (
                    <button 
                        onClick={toggleViewMode}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 flex items-center gap-2 text-sm whitespace-nowrap"
                        title={viewMode === 'admin' ? 'Cambiar a Modo Empleado' : 'Cambiar a Modo Admin'}
                    >
                        {viewMode === 'admin' ? <User /> : <UserCog />}
                        <span className="hidden sm:inline">
                            {viewMode === 'admin' ? 'Modo Empleado' : 'Modo Admin'}
                        </span>
                    </button>
                )}

                <div className="relative">
                    <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2">
                        <img className="h-10 w-10 rounded-full object-cover" src={`https://placehold.co/100x100/D9232D/FFFFFF?text=${user.initials}`} alt="Avatar" />
                        <span className="absolute -right-1 -bottom-1 block h-3.5 w-3.5 rounded-full bg-green-400 ring-2 ring-white dark:ring-gray-800"></span>
                    </button>
                     {profileOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border dark:border-gray-700 z-20">
                            <div className="p-2">
                                <Link 
                                    to="/perfil" 
                                    onClick={() => setProfileOpen(false)}
                                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                                >
                                    <User size={16} />
                                    <span>Mi Perfil</span>
                                </Link>
                                <Link 
                                    to="/ajustes" 
                                    onClick={() => setProfileOpen(false)}
                                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                                >
                                    <Settings size={16} />
                                    <span>Ajustes</span>
                                </Link>
                                <div className="my-1 h-px bg-gray-200 dark:bg-gray-600"></div>
                                <button 
                                    onClick={handleLogoutClick} 
                                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                                >
                                    <LogOut size={16} />
                                    <span>Cerrar Sesión</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {/* Mantenemos AlertDialog aquí para gestionar el logout desde el Header */}
            <AlertDialog
                isOpen={isAlertOpen}
                onClose={handleCloseAlert}
                onConfirm={handleConfirmLogout}
                title="Confirmar Cierre de Sesión"
                message="¿Estás seguro de que quieres cerrar sesión?"
                confirmText="Cerrar Sesión"
                cancelText="Cancelar"
                icon={LogOut}
            />
        </header>
    );
};

export default Header;