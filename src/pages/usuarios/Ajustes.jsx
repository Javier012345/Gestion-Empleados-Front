import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Eye, EyeOff, Loader, CheckCircle, AlertCircle } from 'lucide-react';
import { changePassword } from '../../services/api';
import PasswordStrengthMeter from './PasswordStrengthMeter';


const Ajustes = ({ forceChange = false }) => {
    const navigate = useNavigate();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState({ message: '', type: '' });

    const resetForm = () => {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFeedback({ message: '', type: '' });

        // --- Validaciones de la nueva contraseña ---
        if (newPassword !== confirmPassword) {
            setFeedback({ message: 'La nueva contraseña y su confirmación no coinciden.', type: 'error' });
            return;
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            let errorMessage = 'La nueva contraseña no cumple los requisitos: ';
            const errors = [];
            if (newPassword.length < 8) errors.push('al menos 8 caracteres');
            if (!/[a-z]/.test(newPassword)) errors.push('una minúscula');
            if (!/[A-Z]/.test(newPassword)) errors.push('una mayúscula');
            if (!/\d/.test(newPassword)) errors.push('un número');
            
            errorMessage += errors.join(', ') + '.';
            setFeedback({ message: errorMessage, type: 'error' });
            return;
        }

        setLoading(true);

        const payload = {
            old_password: currentPassword,
            new_password: newPassword,
            new_password2: confirmPassword,
        };

        console.log('Enviando payload a /api/change-password/:', payload);

        try {
            const response = await changePassword(payload);
            setFeedback({ message: response.data.message || 'Contraseña actualizada con éxito.', type: 'success' });
            
            if (forceChange) {
                // Si es cambio forzado, redirigir al inicio después de un breve momento
                setTimeout(() => navigate('/'), 2000);
            } else {
                resetForm();
            }
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Ocurrió un error al cambiar la contraseña.';
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
            <div className={`border px-4 py-3 rounded-lg relative mb-6 flex items-center gap-3 transition-opacity duration-300 ${colors}`} role="alert">
                <Icon className="w-5 h-5" />
                <span className="block sm:inline text-sm">{feedback.message}</span>
                <button
                    onClick={() => setFeedback({ message: '', type: '' })}
                    className="absolute top-0 bottom-0 right-0 px-4 py-3"
                    aria-label="Cerrar"
                >
                    <span className="text-xl">×</span>
                </button>
            </div>
        );
    };


    return (
        <div className={!forceChange ? "max-w-4xl mx-auto" : ""}>
            <div className={!forceChange ? "bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden" : ""}>
                <div className={!forceChange ? "p-6 sm:p-8" : ""}>
                    <div className={`flex items-center gap-4 ${forceChange ? 'justify-center text-center flex-col' : ''}`}>
                        <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-full">
                            <Shield className="h-6 w-6 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                {forceChange ? 'Actualiza tu Contraseña' : 'Seguridad de la Cuenta'}
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {forceChange ? 'Por seguridad, debes establecer una nueva contraseña.' : 'Gestiona tu contraseña y la seguridad de tu cuenta.'}
                            </p>
                        </div>
                    </div>

                    <div className={`mt-8 ${!forceChange ? 'border-t border-gray-200 dark:border-gray-700 pt-6' : ''}`}>
                        {!forceChange && (
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Cambiar Contraseña</h3>
                        )}
                        <form onSubmit={handleSubmit} className="mt-4 space-y-4 max-w-md mx-auto">
                            
                            <FeedbackMessage />

                            {/* No deshabilitar el formulario, ya que el usuario necesita interactuar con él */}
                            {/* <fieldset disabled={forceChange && feedback.type === 'success'}> */}

                            <div>
                                <label htmlFor="current-password"
                                       className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Contraseña Actual
                                </label>
                                <div className="relative">
                                    <input
                                        type={showCurrentPassword ? 'text' : 'password'}
                                        id="current-password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        className="appearance-none block w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 sm:text-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                                    >
                                        {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="new-password"
                                       className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Nueva Contraseña
                                </label>
                                <div className="relative">
                                    <input
                                        type={showNewPassword ? 'text' : 'password'}
                                        id="new-password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="appearance-none block w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 sm:text-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                                    >
                                        {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                            {newPassword && <PasswordStrengthMeter password={newPassword} />}

                            <div>
                                <label htmlFor="confirm-password"
                                       className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Confirmar Nueva Contraseña
                                </label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        id="confirm-password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className={`appearance-none block w-full px-3 py-2.5 border rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 sm:text-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white transition-all ${newPassword && confirmPassword && newPassword !== confirmPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                                    >
                                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {newPassword && confirmPassword && newPassword !== confirmPassword && (
                                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">Las contraseñas no coinciden.</p>
                                )}
                            </div>

                            <div className="pt-2">
                                <button type="submit" className="w-full flex justify-center items-center py-2.5 px-6 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-red-400/80 dark:disabled:bg-red-800/50 disabled:cursor-not-allowed transition-all" disabled={loading || (forceChange && feedback.type === 'success')}>
                                    {loading ? (
                                        <><Loader className="animate-spin mr-2" size={20} /> Procesando...</>
                                    ) : 'Actualizar Contraseña'}
                                </button>
                            </div>
                            {/* </fieldset> */}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Ajustes;