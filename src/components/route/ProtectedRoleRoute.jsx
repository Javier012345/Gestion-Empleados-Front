import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../layout/AuthContext';

const ProtectedRoleRoute = ({ allowedRoles }) => {
    const { isAuthenticated, effectiveRole } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    const isAllowed = allowedRoles.includes(effectiveRole);

    if (isAllowed) {
        return <Outlet />;
    }

    // Si no está permitido, redirige a la página de inicio correspondiente a su rol.
    const homePath = effectiveRole === 'admin' ? '/' : '/perfil';
    return <Navigate to={homePath} replace />;
};

export default ProtectedRoleRoute;