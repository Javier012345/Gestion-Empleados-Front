import React, { useState } from 'react';
import axios from 'axios';
import { Mail, Loader, CheckCircle } from 'lucide-react';
import AuthLayout from '../../components/layout/AuthLayout';
import { Link } from 'react-router-dom';

const ResetPassword = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [feedback, setFeedback] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setFeedback('');

        try {
            await axios.post('http://localhost:8000/api/password-reset/', {
                email: email
            });
            // Como el backend siempre responde con 200 OK, mostramos el mensaje de éxito.
            setFeedback('Si tu correo está registrado, recibirás un enlace para restablecer tu contraseña.');
        } catch (err) {
            // Aunque el backend siempre debería devolver 200, manejamos un posible error de red o del servidor.
            setFeedback('Ocurrió un error al procesar tu solicitud. Por favor, inténtalo de nuevo.');
            console.error('Password reset error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout>
            <div className="text-center mb-8">
                <img src="/images/logo-nuevas-energias-v2.png" alt="Logo" className="mx-auto h-20 w-auto mb-4" />
                <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
                    Restablecer Contraseña
                </h2>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Ingresa tu correo electrónico y te enviaremos un enlace para recuperar tu cuenta.
                </p>
            </div>

            {feedback && (
                <div className="bg-green-100 dark:bg-green-900/20 border border-green-400 dark:border-green-500/50 text-green-700 dark:text-green-300 px-4 py-3 rounded-lg relative mb-6 flex items-center gap-3" role="alert">
                    <CheckCircle className="w-5 h-5" />
                    <span className="block sm:inline text-sm">{feedback}</span>
                </div>
            )}

            {!feedback && (
                <form method="post" noValidate className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Correo Electrónico
                        </label>
                        <div className="mt-1 relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="email"
                                id="email"
                                name="email"
                                required
                                className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                                placeholder="tucorreo@ejemplo.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading || !email}
                            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-red-400/80 dark:disabled:bg-red-800/50 disabled:cursor-not-allowed transition-all"
                        >
                            {isLoading ? <><Loader className="animate-spin mr-2" size={20} /> Enviando...</> : 'Enviar'}
                        </button>
                    </div>
                </form>
            )}

            <div className="mt-6 text-center text-sm">
                <Link to="/login" className="font-medium text-red-600 hover:text-red-500">
                    Volver a Iniciar Sesión
                </Link>
            </div>
        </AuthLayout>
    );
};

export default ResetPassword;