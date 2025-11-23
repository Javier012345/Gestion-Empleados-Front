import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Lock, Eye, EyeOff, Loader, CheckCircle, AlertCircle } from 'lucide-react';
import AuthLayout from '../../components/layout/AuthLayout';
import PasswordStrengthMeter from './PasswordStrengthMeter';

const ConfirmPasswordReset = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const uid = searchParams.get('uid');
    const token = searchParams.get('token');

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState({ message: '', type: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFeedback({ message: '', type: '' });

        if (newPassword !== confirmPassword) {
            setFeedback({ message: 'Las contraseñas no coinciden.', type: 'error' });
            return;
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            setFeedback({ message: 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número.', type: 'error' });
            return;
        }

        setLoading(true);
        const payload = {
            uid,
            token,
            new_password: newPassword,
            new_password2: confirmPassword,
        };

        console.log('Enviando payload para restablecer contraseña:', payload);

        try {
            await axios.post('http://localhost:8000/api/password-reset/confirm/', payload);
            setFeedback({ message: '¡Tu contraseña ha sido restablecida con éxito! Ahora puedes iniciar sesión.', type: 'success' });
            setTimeout(() => navigate('/login'), 3000);
        } catch (error) {
            console.error('Error al intentar restablecer la contraseña:', error);
            if (error.response) {
                console.error('Respuesta del servidor:', error.response.data);
            }
            const errorMessage = error.response?.data?.error || 'El enlace de restablecimiento no es válido o ha expirado. Por favor, solicita uno nuevo.';
            setFeedback({ message: errorMessage, type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const FeedbackMessage = () => {
        if (!feedback.message) return null;
        const isError = feedback.type === 'error';
        const Icon = isError ? AlertCircle : CheckCircle;
        const colors = isError
            ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-400 dark:border-red-500/50'
            : 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-400 dark:border-green-500/50';

        return (
            <div className={`border px-4 py-3 rounded-lg relative mb-6 flex items-center gap-3 ${colors}`} role="alert">
                <Icon className="w-5 h-5" />
                <span className="block sm:inline text-sm">{feedback.message}</span>
            </div>
        );
    };

    return (
        <AuthLayout>
            <div className="text-center mb-8">
                <img src="/images/logo-nuevas-energias-v2.png" alt="Logo" className="mx-auto h-20 w-auto mb-4" />
                <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
                    Crear Nueva Contraseña
                </h2>
            </div>

            <FeedbackMessage />

            {feedback.type !== 'success' && (
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nueva Contraseña</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type={showNewPassword ? 'text' : 'password'}
                                id="new-password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="appearance-none block w-full pl-10 pr-10 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500/50 sm:text-sm bg-white dark:bg-gray-700"
                                required
                            />
                            <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500">
                                {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        {newPassword && <PasswordStrengthMeter password={newPassword} />}
                    </div>

                    <div>
                        <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirmar Nueva Contraseña</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                id="confirm-password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className={`appearance-none block w-full pl-10 pr-10 py-2.5 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500/50 sm:text-sm bg-white dark:bg-gray-700 ${newPassword && confirmPassword && newPassword !== confirmPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                                required
                            />
                            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500">
                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        {newPassword && confirmPassword && newPassword !== confirmPassword && (
                            <p className="text-xs text-red-600 dark:text-red-400 mt-1">Las contraseñas no coinciden.</p>
                        )}
                    </div>

                    <div>
                        <button type="submit" disabled={loading} className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-red-400/80">
                            {loading ? <><Loader className="animate-spin mr-2" size={20} /> Actualizando...</> : 'Restablecer Contraseña'}
                        </button>
                    </div>
                </form>
            )}

            {feedback.type === 'success' && (
                <div className="text-center">
                    <Link to="/login" className="font-medium text-red-600 hover:text-red-500">
                        Ir a Iniciar Sesión
                    </Link>
                </div>
            )}
        </AuthLayout>
    );
};

export default ConfirmPasswordReset;