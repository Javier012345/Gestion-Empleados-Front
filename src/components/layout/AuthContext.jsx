import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCookie } from '../../services/api'; // Importamos la función para leer cookies

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // 1. Añadimos el estado de carga
    const [viewMode, setViewMode] = useState('employee'); // Por defecto, modo empleado
    const navigate = useNavigate();

    useEffect(() => {
        // 2. Verificamos la sesión al cargar la app
        const initializeAuth = () => {
            const token = getCookie('token');
            const storedUser = localStorage.getItem('user');

            if (token && storedUser) {
                // Si hay token y usuario, lo restauramos
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser); // Usamos setUser directamente para no causar bucles
                if (parsedUser.grupo !== 'Empleado') {
                    setViewMode('admin');
                }
            }
            setLoading(false); // 3. Marcamos que la carga ha terminado
        }
        initializeAuth();
    }, []);

    const login = (userData) => {
        const initials = userData.nombre && userData.apellido
            ? `${userData.nombre[0]}${userData.apellido[0]}`.toUpperCase()
            : userData.username.substring(0, 2).toUpperCase();
        
        const userWithInitials = { ...userData, initials };
        
        setUser(userWithInitials);
        localStorage.setItem('user', JSON.stringify(userWithInitials));

        // Establecer el modo de vista inicial
        if (userData.grupo !== 'Empleado') {
            setViewMode('admin');
        } else {
            setViewMode('employee');
        }
    };

    const logout = () => {
        setUser(null);
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        localStorage.removeItem('user');
        navigate('/login');
    };

    const toggleViewMode = () => {
        if (user && user.grupo !== 'Empleado') {
            const newMode = viewMode === 'admin' ? 'employee' : 'admin';
            setViewMode(newMode);

            // Redirigir al cambiar de modo para una mejor experiencia de usuario.
            if (newMode === 'admin') {
                navigate('/'); // Al cambiar a Modo Admin, ir al inicio.
            } else {
                navigate('/perfil'); // Al cambiar a Modo Empleado, ir al perfil.
            }
        }
    };

    const value = {
        user,
        loading, // 4. Exponemos el estado de carga
        viewMode,
        login,
        logout,
        toggleViewMode: toggleViewMode, // Exponemos la función para cambiar el modo
        isAuthenticated: !!user,
        // El rol efectivo tiene en cuenta el modo de vista
        effectiveRole: user?.grupo === 'Empleado' ? 'employee' : viewMode,
    };

    return (
        <AuthContext.Provider value={value}>
            {/* 5. No renderizamos los hijos hasta que la verificación inicial haya terminado */}
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};