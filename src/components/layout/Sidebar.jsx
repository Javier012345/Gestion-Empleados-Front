import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Receipt, CalendarDays, ShieldAlert, AlertTriangle, Camera, ClipboardList, LogOut, X, User } from 'lucide-react';

const adminLinks = [
    { icon: <LayoutDashboard size={20} />, name: 'Inicio', path: '/' },
    { icon: <Users size={20} />, name: 'Empleados', path: '/empleados' },
    { icon: <Receipt size={20} />, name: 'Recibos', path: '/recibos' },
    { icon: <CalendarDays size={20} />, name: 'Horarios', path: '/horarios' },
    { icon: <ShieldAlert size={20} />, name: 'Sanciones', path: '/sanciones' },
    { icon: <AlertTriangle size={20} />, name: 'Incidentes', path: '/incidentes' },
    { icon: <Camera size={20} />, name: 'Asistencia', path: '/asistencia' },
    { icon: <ClipboardList size={20} />, name: 'Reportes', path: '/reportes' },
];

const employeeLinks = [
    { icon: <User size={20} />, name: 'Mi Perfil', path: '/perfil' },
    { icon: <Receipt size={20} />, name: 'Mis Recibos', path: '/mis-recibos' },
    { icon: <CalendarDays size={20} />, name: 'Mis Horarios', path: '/horarios/mis-horarios' },
    { icon: <AlertTriangle size={20} />, name: 'Mis Incidentes', path: '/mis-incidentes' },
    { icon: <ShieldAlert size={20} />, name: 'Mis Sanciones', path: '/mis-sanciones' },
    { icon: <Camera size={20} />, name: 'Mis Asistencias', path: '/mis-asistencias' },
];

const NavLinks = ({ links }) => (
    <nav className="flex-1 px-4 py-6 space-y-1.5">
        {links.map(link => (
            <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                    `group flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-red-600 hover:text-white transition-all duration-200 ` +
                    (isActive ? 'bg-red-600 text-white' : '')
                }
            >
                {link.icon}
                <span className="font-medium">{link.name}</span>
            </NavLink>
        ))}
    </nav>
);

const Sidebar = ({ isOpen, onClose, userRole }) => {
    const links = userRole === 'admin' ? adminLinks : employeeLinks;

    return (
        <>
            {/* Sidebar de Escritorio */}
            <aside className="w-64 flex-shrink-0 bg-white dark:bg-gray-800 shadow-md hidden lg:flex flex-col">
                <div className="h-24 flex items-center justify-center px-4 pt-4">
                    <img src="/images/logo-nuevas-energias-v2.png" alt="Nuevas Energias" className="w-[150px] h-auto" />
                </div>
                <NavLinks links={links} />
                <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700">
                    <a href="#" className="group flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-red-600 hover:text-white">
                        <LogOut size={20} />
                        <span className="font-medium">Cerrar sesión</span>
                    </a>
                </div>
            </aside>
            {/* Overlay for mobile */}
            <div
                className={`fixed inset-0 bg-black/60 z-30 md:hidden ${
                    isOpen ? 'block' : 'hidden'
                }`}
                onClick={onClose}
            ></div>

            {/* Sidebar Móvil */}
            <aside className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 z-30 flex flex-col lg:hidden transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                 <div className="h-24 flex items-center justify-between px-4 pt-4">
                    <img src="/images/logo-nuevas-energias-v2.png" alt="Nuevas Energias" className="w-[150px] h-auto" />
                    <button onClick={onClose} className="p-1 text-gray-600 dark:text-gray-300">
                        <X size={24} />
                    </button>
                </div>
                <NavLinks links={links} />
                 <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700">
                    <a href="#" className="group flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-red-600 hover:.text-white">
                        <LogOut size={20} />
                        <span className="font-medium">Cerrar sesión</span>
                    </a>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;