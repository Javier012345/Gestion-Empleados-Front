import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../layout/AuthContext';
import { Loader } from 'lucide-react';

const PrivateRoute = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="flex h-screen w-full items-center justify-center"><Loader className="animate-spin text-red-600" size={48} /></div>;
    }

    return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
