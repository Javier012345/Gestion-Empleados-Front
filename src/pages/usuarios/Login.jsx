import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, AlertCircle, Loader } from 'lucide-react';
import { useAuth } from '../../components/layout/AuthContext';
import AuthLayout from '../../components/layout/AuthLayout';

const Login = () => {
    // --- ESTADO --- //
    const [error, setError] = useState(null);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const setCookie = (name, value, days) => {
        let expires = "";
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    };

    // --- MANEJADORES DE EVENTOS --- //

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.post('http://localhost:8000/api/login/', {
                username,
                password
            });
            const { token, must_change_password, ...userData } = response.data;
            setCookie('token', token, 7); // Store token in cookie for 7 days
            
            // Usamos la función de login del contexto
            login({
                id: userData.user.id,
                username: userData.user.username,
                ...userData
            });

            if (must_change_password) {
                navigate('/cambiar-contrasena');
            } else {
                navigate('/'); // Redirect to home page after login
            }
        } catch (err) {
            const errorMessage = err.response?.data?.error || 'Usuario o contraseña incorrectos.';
            setError(errorMessage);
            console.error('Login error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // --- RENDERIZADO --- //

    return (
        <AuthLayout>
            <div className="text-center mb-8">
                        {/* Asumimos que el logo está en la carpeta `public/images` */}
                        <img src="/images/logo-nuevas-energias-v2.png" alt="Logo" className="mx-auto h-20 w-auto mb-4" />
                        <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
                            Iniciar sesión
                        </h2>
                    </div>

            {error && (
                        <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-500/50 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg relative mb-6 flex items-center gap-3" role="alert">
                            <AlertCircle className="w-5 h-5" />
                            <span className="block sm:inline text-sm">{error}</span>
                        </div>
                    )}

            <form method="post" noValidate className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Nombre de usuario
                            </label>
                            <div className="mt-1 relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    required
                                    className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                                    placeholder="Ingrese su nombre de usuario"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Contraseña
                            </label>
                            <div className="mt-1 relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    required
                                    className="appearance-none block w-full pl-10 pr-10 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                                    placeholder="Ingrese su contraseña"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    id="togglePassword"
                                    className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-r-lg"
                                    tabIndex="-1"
                                    onClick={togglePasswordVisibility}
                                >
                                    {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-red-400 disabled:cursor-not-allowed transition-all"
                            >
                                {isLoading ? (
                                    <><Loader className="animate-spin mr-2" size={20} /> Ingresando...</>
                                ) : (
                                    'Ingresar'
                                )}
                            </button>
                        </div>
                    </form>

            <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                                    Opciones
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 text-center text-sm">
                            <Link to="/restablecer-contrasena" className="font-medium text-red-600 hover:text-red-500">
                                ¿Olvidaste tu contraseña?
                            </Link>
                        </div>
            </div>
        </AuthLayout>
    );
};

export default Login;
