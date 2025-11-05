import React from 'react';
import { NavLink } from 'react-router-dom';

// Debemos importar los iconos de Lucide o usar un componente de icono
// Por ahora, usaremos strings como placeholders
const Icon = ({ name }) => <i data-lucide={name}></i>;

const Sidebar = () => {
    // En el futuro, esta variable vendrá del estado de la app o de un contexto de autenticación
    const isEmployeeView = false; 

    const adminLinks = (
        <>
            <NavLink to="/" className="nav-link group flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gradient-to-r hover:from-red-600 hover:to-red-500 hover:text-white dark:hover:from-red-700 dark:hover:to-red-600">
                <Icon name="layout-dashboard" />
                <span>Inicio</span>
            </NavLink>
            <NavLink to="/empleados" className="nav-link group flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gradient-to-r hover:from-red-600 hover:to-red-500 hover:text-white dark:hover:from-red-700 dark:hover:to-red-600">
                <Icon name="users" />
                <span>Empleados</span>
            </NavLink>
            {/* Agrega el resto de los links de admin aquí */}
        </>
    );

    const employeeLinks = (
        <>
            <NavLink to="/perfil" className="nav-link group flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gradient-to-r hover:from-red-600 hover:to-red-500 hover:text-white dark:hover:from-red-700 dark:hover:to-red-600">
                <Icon name="user-circle" />
                <span>Mi Perfil</span>
            </NavLink>
            <NavLink to="/recibos" className="nav-link group flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gradient-to-r hover:from-red-600 hover:to-red-500 hover:text-white dark:hover:from-red-700 dark:hover:to-red-600">
                <Icon name="receipt" />
                <span>Mis Recibos</span>
            </NavLink>
            {/* Agrega el resto de los links de empleado aquí */}
        </>
    );

    return (
        <>
            {/* --- Barra lateral de escritorio --- */}
            <aside id="desktop-sidebar" className="w-64 flex-shrink-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 hidden lg:flex flex-col">
                <div className="h-24 flex items-center justify-center px-4 pt-4">
                    <img src="/images/logo-nuevas-energias-v2.png" alt="Nuevas Energias" className="w-[150px] h-auto" />
                </div>
                <nav className="flex-1 px-4 py-6 space-y-1.5 mt-4">
                    {isEmployeeView ? employeeLinks : adminLinks}
                </nav>
                <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700">
                    <a href="#" className="group flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gradient-to-r hover:from-red-600 hover:to-red-500 hover:text-white">
                        <Icon name="log-out" />
                        <span>Cerrar sesión</span>
                    </a>
                </div>
            </aside>

            {/* --- Barra lateral móvil (la lógica de abrir/cerrar se manejará en Layout.js) --- */}
            <aside id="mobile-sidebar" className="fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 z-30 flex flex-col sidebar-mobile-closed lg:hidden">
                 <div className="h-24 grid grid-cols-[1fr,auto,1fr] items-center px-4 pt-4">
                    <div></div>
                    <div className="flex justify-center">
                        <img src="/images/logo-nuevas-energias-v2.png" alt="Nuevas Energias" style={{ width: '160px', height: '100px' }} />
                    </div>
                    <button id="close-mobile-menu" className="p-1 justify-self-end"><Icon name="x" /></button>
                </div>
                <nav className="flex-1 px-4 py-6 space-y-2 mt-4">
                    {isEmployeeView ? employeeLinks : adminLinks}
                </nav>
                <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700">
                    <a href="#" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-red-600 hover:text-white">
                        <Icon name="log-out" />
                        <span>Cerrar sesión</span>
                    </a>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
