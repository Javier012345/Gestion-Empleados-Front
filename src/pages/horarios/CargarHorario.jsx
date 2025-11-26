import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Settings, CheckCircle, AlertTriangle, Loader } from 'lucide-react';
import { createHorario } from '../../services/api';

const plantillas = {
    manana: {
        nombre: 'Turno Mañana',
        hora_entrada: '09:00:00',
        hora_salida: '13:00:00',
        lunes: true,
        martes: true,
        miercoles: true,
        jueves: true,
        viernes: true,
        sabado: false,
        domingo: false,
    },
    tarde: {
        nombre: 'Turno Tarde',
        hora_entrada: '14:00:00',
        hora_salida: '18:00:00',
        lunes: true,
        martes: true,
        miercoles: true,
        jueves: true,
        viernes: true,
        sabado: false,
        domingo: false,
    }
};

const CargarHorario = () => {
    const [activeTab, setActiveTab] = useState('preset');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    return (
        <div className="text-gray-900 dark:text-gray-100">
            <div className="mb-6 flex items-center justify-between border-b border-gray-500 dark:border-gray-700">
                <nav className="flex space-x-4" aria-label="Tabs">
                    <button 
                        onClick={() => setActiveTab('preset')}
                        className={`group flex items-center gap-2 py-3 px-4 border-b-2 font-medium text-sm transition-all duration-200 ${
                            activeTab === 'preset' ? 'border-red-500 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}>
                        <Clock size={16} />
                        <span>Desde Plantilla</span>
                    </button>
                    <button 
                        onClick={() => setActiveTab('custom')}
                        className={`group flex items-center gap-2 py-3 px-4 border-b-2 font-medium text-sm transition-all duration-200 ${
                            activeTab === 'custom' ? 'border-red-500 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}>
                        <Settings size={16} />
                        <span>Personalizado</span>
                    </button>
                </nav>
            </div>

            {success && (
                <div className="mb-4 flex items-center gap-3 rounded-lg bg-green-100 dark:bg-green-900/20 p-4 text-sm text-green-800 dark:text-green-300 border border-green-400 dark:border-green-700">
                    <CheckCircle className="h-5 w-5" />
                    <p>{success}</p>
                </div>
            )}
            {error && (
                <div className="mb-4 flex items-center gap-3 rounded-lg bg-red-100 dark:bg-red-900/20 p-4 text-sm text-red-800 dark:text-red-300 border border-red-400 dark:border-red-700">
                    <AlertTriangle className="h-5 w-5" />
                    <p>{error}</p>
                </div>
            )}

            {activeTab === 'preset' && (
                <PresetForm isSubmitting={isSubmitting} setIsSubmitting={setIsSubmitting} setError={setError} navigate={navigate} />
            )}

            {activeTab === 'custom' && (
                <CustomForm isSubmitting={isSubmitting} setIsSubmitting={setIsSubmitting} setError={setError} navigate={navigate} />
            )}
        </div>
    );
};

const PresetForm = ({ isSubmitting, setIsSubmitting, setError, navigate }) => {
    const [selected, setSelected] = useState('manana');
    const [cantidad, setCantidad] = useState(1);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        if (parseInt(cantidad, 10) < 1 || !cantidad) {
            setError("La cantidad de personal debe ser como mínimo 1.");
            setIsSubmitting(false);
            return;
        }

        try {
            const current = plantillas[selected];
            const horarioData = {
                ...current,
                cantidad_personal_requerida: parseInt(cantidad, 10),
            };
            await createHorario(horarioData);
            navigate('/horarios', { 
                state: { successMessage: `Horario "${current.nombre}" creado con éxito.` } 
            });
        } catch (err) {
            if (err.response && err.response.status === 400) {
                setError('El horario ya existe. Por favor, elige un nombre diferente.');
            } else {
                setError(err.response?.data?.detail || err.message || 'Error al crear el horario.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const current = plantillas[selected];

    return (
        <div className="max-w-md mx-auto">
            <div className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/10 dark:to-red-900/20 p-4 rounded-lg mb-6 border border-red-300 dark:border-red-800">
                <h3 className="text-lg font-semibold mb-2 text-red-800 dark:text-red-200">Crear Horario desde Plantilla</h3>
                <p className="text-sm text-red-700 dark:text-red-300">Crea rápidamente los turnos comunes de mañana o tarde.</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">Turno</label>
                    <select value={selected} onChange={(e) => setSelected(e.target.value)} className="w-full rounded-lg border-gray-500 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-gray-900 dark:text-white">
                        <option value="manana">Turno Mañana</option>
                        <option value="tarde">Turno Tarde</option>
                    </select>
                </div>

                <div className="space-y-3 p-4 border rounded-lg border-gray-400 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/30 text-gray-800 dark:text-gray-200">
                    <p className="text-sm"><span className="font-semibold">Horario:</span> {current.hora_entrada.slice(0,5)} - {current.hora_salida.slice(0,5)}</p>
                    <p className="text-sm"><span className="font-semibold">Días:</span> Lunes a Viernes</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">Cantidad de Personal Requerida</label>
                    <input type="text" inputMode="numeric" pattern="[0-9]*" value={cantidad} onChange={(e) => setCantidad(e.target.value.replace(/[^0-9]/g, ''))} className="w-full rounded-lg border-gray-500 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-gray-900 dark:text-white" />
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 mt-4 disabled:bg-red-400">
                    {isSubmitting ? <><Loader size={20} className="animate-spin" /> <span className="ml-2">Creando...</span></> : 'Crear Horario'}
                </button>
            </form>
        </div>
    );
};

const CustomForm = ({ isSubmitting, setIsSubmitting, setError, navigate }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        hora_entrada: '09:00',
        hora_salida: '18:00',
        lunes: false,
        martes: false,
        miercoles: false,
        jueves: false,
        viernes: false,
        sabado: false,
        domingo: false,
        cantidad_personal_requerida: 1,
    });

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name === 'cantidad_personal_requerida') {
            const numericValue = value.replace(/[^0-9]/g, '');
            setFormData(prev => ({
                ...prev,
                [name]: numericValue
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        // --- Validaciones ---
        const { nombre, hora_entrada, hora_salida, cantidad_personal_requerida } = formData;
        if (!nombre.trim() || !hora_entrada || !hora_salida || !cantidad_personal_requerida) {
            setError("Todos los campos son obligatorios.");
            setIsSubmitting(false);
            return;
        }

        const diasSeleccionados = Object.keys(formData).filter(key => typeof formData[key] === 'boolean' && formData[key]);
        if (diasSeleccionados.length === 0) {
            setError("Debe seleccionar al menos un día de la semana.");
            setIsSubmitting(false);
            return;
        }

        const cantidadRequerida = parseInt(formData.cantidad_personal_requerida, 10);
        if (isNaN(cantidadRequerida) || cantidadRequerida < 1) {
            setError("La cantidad de personal debe ser como mínimo 1.");
            setIsSubmitting(false);
            return;
        }

        try {
            const horarioData = {
                ...formData,
                hora_entrada: `${formData.hora_entrada}:00`,
                hora_salida: `${formData.hora_salida}:00`,
                cantidad_personal_requerida: parseInt(formData.cantidad_personal_requerida, 10) || 1
            };
            await createHorario(horarioData);
            navigate('/horarios', { 
                state: { successMessage: `Horario "${formData.nombre}" creado con éxito.` } 
            });
        } catch (err) {
            if (err.response && err.response.status === 400) {
                setError('El horario ya existe. Por favor, elige un nombre diferente.');
            } else {
                setError(err.response?.data?.detail || err.message || 'Error al crear el horario personalizado.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };
    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/10 dark:to-blue-900/20 p-4 rounded-lg mb-6 border border-blue-300 dark:border-blue-800">
                <h3 className="text-lg font-semibold mb-2 text-blue-800 dark:text-blue-200">Crear Horario Personalizado</h3>
                <p className="text-sm text-blue-700 dark:text-blue-300">Define un horario con horas y días específicos.</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">Nombre del Horario</label>
                    <input type="text" name="nombre" value={formData.nombre} onChange={handleInputChange} className="w-full rounded-lg border-gray-500 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-gray-900 dark:text-white" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">Hora Entrada</label>
                        <input type="time" name="hora_entrada" value={formData.hora_entrada} onChange={handleInputChange} className="w-full rounded-lg border-gray-500 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-gray-900 dark:text-white" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">Hora Salida</label>
                        <input type="time" name="hora_salida" value={formData.hora_salida} onChange={handleInputChange} className="w-full rounded-lg border-gray-500 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-gray-900 dark:text-white" />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">Días de la semana</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
                        {Object.keys(plantillas.manana).filter(k => typeof plantillas.manana[k] === 'boolean').map(day => (
                            <label key={day} className="flex items-center justify-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors duration-200 has-[:checked]:bg-red-600 has-[:checked]:border-red-600 has-[:checked]:text-white border-gray-400 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-red-400 dark:hover:border-red-500">
                                <input type="checkbox" name={day} checked={formData[day]} onChange={handleInputChange} className="sr-only" />
                                <span className="font-medium text-gray-800 dark:text-gray-200 capitalize">{day}</span>
                            </label>
                        ))}
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">Cantidad de Personal Requerida</label>
                    <input type="text" inputMode="numeric" pattern="[0-9]*" name="cantidad_personal_requerida" value={formData.cantidad_personal_requerida} onChange={handleInputChange} className="w-full rounded-lg border-gray-500 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-gray-900 dark:text-white" />
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-red-400">
                    {isSubmitting ? <><Loader size={20} className="animate-spin" /> <span className="ml-2">Guardando...</span></> : 'Guardar Horario Personalizado'}
                </button>
            </form>
        </div>
    );
};

export default CargarHorario;
