import React, { useState, useContext } from 'react';
import { Menu, Sun, Moon, Bell, UserCog, User, ChevronDown } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';

const Header = ({ onMenuClick, pageTitle }) => {
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const { theme, toggleTheme } = useContext(ThemeContext);

    // Datos de ejemplo
    const notifications_count = 3;
    const user = { name: 'Admin User', initials: 'AU' };
    const view_as_employee = false;

    return (
        <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 sm:px-6 flex-shrink-0">
            <div className="flex items-center gap-4">
                <button onClick={onMenuClick} className="lg:hidden text-gray-600 dark:text-gray-300 p-2 rounded-lg">
                    <Menu size={20} />
                </button>
                <h1 className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
                    {pageTitle || 'Dashboard'}
                </h1>
            </div>

            <div className="flex items-center gap-3 sm:gap-4">
                <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300">
                    {theme === 'light' ? <Moon /> : <Sun />}
                </button>

                <div className="relative">
                    <button onClick={() => setNotificationsOpen(!notificationsOpen)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300">
                        <Bell size={20} />
                        {notifications_count > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[10px] text-white font-medium items-center justify-center">
                                    {notifications_count}
                                </span>
                            </span>
                        )}
                    </button>
                    {notificationsOpen && (
                        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border dark:border-gray-700 z-20">
                            <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
                                <h3 className="font-semibold">Notificaciones ({notifications_count})</h3>
                                <button className="text-sm text-red-600 hover:underline">Marcar como leídas</button>
                            </div>
                            <div className="max-h-96 overflow-y-auto divide-y dark:divide-gray-700">
                                {/* Aquí iría la lista de notificaciones */}
                                <a href="#" className="block p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    <p className="text-sm font-medium">Ejemplo de notificación</p>
                                    <span className="text-xs text-gray-500">hace 5 minutos</span>
                                </a>
                            </div>
                            <div className="p-2 bg-gray-50 dark:bg-gray-700/50 border-t dark:border-gray-700 text-center">
                                <a href="#" className="text-sm text-gray-600 dark:text-gray-300 hover:underline">Ver todas</a>
                            </div>
                        </div>
                    )}
                </div>

                {/* Role Switcher */}
                <a href="#" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 flex items-center gap-2 text-sm whitespace-nowrap">
                    {view_as_employee ? <UserCog /> : <User />}
                    <span className="hidden sm:inline">{view_as_employee ? 'Modo Admin' : 'Modo Empleado'}</span>
                </a>

                <div className="relative">
                    <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2">
                        <img className="h-10 w-10 rounded-full object-cover" src={`https://placehold.co/100x100/D9232D/FFFFFF?text=${user.initials}`} alt="Avatar" />
                        <span className="absolute -right-1 -bottom-1 block h-3.5 w-3.5 rounded-full bg-green-400 ring-2 ring-white dark:ring-gray-800"></span>
                    </button>
                     {profileOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border dark:border-gray-700 z-20">
                            <div className="p-2">
                                <a href="#" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">Mi Perfil</a>
                                <a href="#" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">Ajustes</a>
                                <div className="my-1 h-px bg-gray-200 dark:bg-gray-600"></div>
                                <a href="#" className="block px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">Cerrar Sesión</a>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
