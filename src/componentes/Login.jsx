import React, { useState, useEffect, useRef } from 'react';

const Login = () => {
    // --- ESTADO --- //
    // Simula el contexto que venía de Django
    // Puedes cambiar estos valores para probar diferentes escenarios
    const [error, setError] = useState(null); // Ejemplo: 'Usuario o contraseña incorrectos.'
    const [isBlocked, setIsBlocked] = useState(false);
    const [blockedUntil, setBlockedUntil] = useState(null); // Ejemplo: new Date(Date.now() + 30000)

    // Estado para los campos del formulario
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // Estado para el temporizador
    const [timeLeft, setTimeLeft] = useState('');
    const intervalRef = useRef(null);

    // --- EFECTOS --- //

    // Efecto para manejar el temporizador de bloqueo
    useEffect(() => {
        if (isBlocked && blockedUntil) {
            intervalRef.current = setInterval(() => {
                const now = new Date();
                const remaining = blockedUntil - now;

                if (remaining <= 0) {
                    clearInterval(intervalRef.current);
                    setIsBlocked(false);
                    setBlockedUntil(null);
                    setError(null);
                    // Opcional: recargar la página como en el script original
                    // window.location.reload(); 
                    return;
                }

                const minutes = Math.floor((remaining / 1000) / 60);
                const seconds = Math.floor((remaining / 1000) % 60);
                setTimeLeft(`${minutes} m y ${seconds} s`);
                setError(`Has superado el número máximo de intentos. Inténtalo de nuevo en `);

            }, 1000);
        }
        return () => clearInterval(intervalRef.current);
    }, [isBlocked, blockedUntil]);

    // --- MANEJADORES DE EVENTOS --- //

    const handleSubmit = (e) => {
        e.preventDefault();
        // Aquí iría la lógica para enviar los datos a tu API de Django
        console.log('Intentando iniciar sesión con:', { username, password });

        // Simulación de un intento de login fallido que causa bloqueo
        setError('Usuario o contraseña incorrectos.');
        // Después de 3 intentos fallidos, la API debería responder con un estado de bloqueo.
        // Aquí lo simulamos:
        const attempts = 3;
        if (attempts >= 3) {
            setIsBlocked(true);
            setBlockedUntil(new Date(Date.now() + 30000)); // Bloqueo de 30 segundos para el ejemplo
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // --- RENDERIZADO --- //

    const EyeOpenIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye">
            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    );

    const EyeClosedIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye-off">
            <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
            <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
            <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
            <line x1="2" x2="22" y1="2" y2="22" />
        </svg>
    );

    return (
        <div className="bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
            <div className="min-h-screen flex items-center justify-center">
                <div className="max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 m-4">
                    <div className="text-center mb-8">
                        {/* Asumimos que el logo está en la carpeta `public/images` */}
                        <img src="/images/logo-nuevas-energias-v2.png" alt="Logo" className="mx-auto h-20 w-auto" />
                        <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
                            Iniciar sesión
                        </h2>
                    </div>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                            <strong className="font-bold">Error:</strong>
                            <span className="block sm:inline">{error}</span>
                            {isBlocked && <span id="tiempo-bloqueo">{timeLeft}</span>}
                        </div>
                    )}

                    <form method="post" noValidate className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Nombre de usuario
                            </label>
                            <div className="mt-1">
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    required
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                                    placeholder="Ingrese su nombre de usuario"
                                    disabled={isBlocked}
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
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    required
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                                    placeholder="Ingrese su contraseña"
                                    disabled={isBlocked}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    id="togglePassword"
                                    className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                                    tabIndex="-1"
                                    onClick={togglePasswordVisibility}
                                >
                                    <span id="icon-eye">
                                        {showPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
                                    </span>
                                </button>
                            </div>
                        </div>

                        {!isBlocked && (
                            <div>
                                <button
                                    type="submit"
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                >
                                    Ingresar
                                </button>
                            </div>
                        )}
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
                            <a href="#" className="font-medium text-red-600 hover:text-red-500">
                                ¿Olvidaste tu contraseña?
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
