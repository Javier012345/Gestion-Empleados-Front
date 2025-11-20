import React, { useState, useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './layout/Sidebar.jsx';
import Header from './layout/Header.jsx';
import { ThemeContext } from '../context/ThemeContext';

const AppLayout = ({ children, pageTitle }) => {
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { theme, toggleTheme } = useContext(ThemeContext);
    const location = useLocation();
    const navigate = useNavigate();

    // Simulación de usuario logueado.
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
        isAdmin: true,
        initials: getInitials('Maxi K')
    };

    const [viewMode, setViewMode] = useState(currentUser.isAdmin ? 'admin' : 'employee');

    useEffect(() => {
        const adminRoutes = [
            '/empleados', '/recibos', '/horarios', '/sanciones', '/incidentes', 
            '/asistencia', '/reportes'
        ];
        const employeeRoutes = [
            '/perfil', '/mis-recibos', '/mis-horarios', '/mis-sanciones', 
            '/mis-incidentes', '/mis-asistencias'
        ];

        const currentPath = location.pathname;

        if (adminRoutes.some(route => currentPath.startsWith(route))) {
            setViewMode('admin');
        } else if (employeeRoutes.some(route => currentPath.startsWith(route))) {
            setViewMode('employee');
        }
        // Si no coincide con ninguna, mantiene el modo actual, que puede haber sido cambiado manualmente.
    }, [location.pathname]);

    const handleToggleViewMode = () => {
        setViewMode(prevMode => {
            const newMode = prevMode === 'admin' ? 'employee' : 'admin';
            if (newMode === 'employee') {
                navigate('/perfil');
            } else {
                navigate('/empleados');
            }
            return newMode;
        });
    };

    return (
        <div className="flex h-screen">
            <Sidebar 
                isOpen={isMobileMenuOpen} 
                onClose={() => setMobileMenuOpen(false)}
                userRole={viewMode}
            />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header 
                    onOpenMobileMenu={() => setMobileMenuOpen(true)}
                    user={currentUser}
                    viewMode={viewMode}
                    theme={theme}
                    toggleTheme={toggleTheme}
                    pageTitle={pageTitle}
                    onToggleViewMode={handleToggleViewMode}
                />
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-4">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AppLayout;