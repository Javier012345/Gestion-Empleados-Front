import React, { useState, useEffect } from 'react';
import Sidebar from './layout/Sidebar.jsx';
import Header from './layout/Header.jsx';

const AppLayout = ({ children, pageTitle }) => {
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    
    // Simulación de usuario logueado. En una aplicación real, esto vendría de tu contexto de autenticación.
    // Asumimos que el usuario tiene una propiedad 'isAdmin' y 'name'.
    const getInitials = (name) => {
        if (!name) return '';
        const nameParts = name.split(' ');
        if (nameParts.length > 1) {
            return nameParts[0][0] + nameParts[nameParts.length - 1][0];
        }
        return nameParts[0].slice(0, 2);
    };

    const currentUser = { 
        name: 'Maxi K', 
        isAdmin: true, // Cambia a false para probar el modo empleado por defecto
        initials: getInitials('Maxi K')
    };

    // Estado para gestionar la vista. Por defecto, 'admin' si el usuario es admin, sino 'employee'.
    const [viewMode, setViewMode] = useState(currentUser.isAdmin ? 'admin' : 'employee');

    // Estado para el tema (claro u oscuro)
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    // Función para cambiar el tema
    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    };

    // Efecto secundario para aplicar el tema al cargar el componente y cada vez que cambia el tema
    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
    }, [theme]);

    const handleToggleViewMode = () => {
        setViewMode(prevMode => (prevMode === 'admin' ? 'employee' : 'admin'));
    };

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
            <Sidebar 
                isOpen={isMobileMenuOpen} 
                onClose={() => setMobileMenuOpen(false)}
                userRole={viewMode} // Pasa el modo de vista actual al Sidebar
            />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header 
                    onOpenMobileMenu={() => setMobileMenuOpen(true)}
                    user={currentUser} // Pasa la información del usuario al Header
                    viewMode={viewMode}
                    theme={theme} // Pasa el tema actual al Header
                    toggleTheme={toggleTheme} // Pasa la función para cambiar el tema al Header
                    pageTitle={pageTitle} // Pasa el título de la página al Header
                    onToggleViewMode={handleToggleViewMode} // Pasa la función para cambiar de modo al Header
                />
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-4">
                    {children} {/* Aquí se renderizará el contenido de cada página */}
                </main>
            </div>
        </div>
    );
};

export default AppLayout;