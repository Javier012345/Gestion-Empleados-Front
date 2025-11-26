import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Users, User, ChevronDown, AlertTriangle, Loader, Edit, X, Clock, CheckCircle, Trash2 } from 'lucide-react';
import { getHorarios, updateHorario, deleteHorario } from '../../services/api';

// --- Sub-componente: Modal de Edición ---
const EditHorarioModal = ({ isOpen, onClose, horario, onUpdateSuccess }) => {
    const [formData, setFormData] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState('');

    useEffect(() => {
        if (isOpen && horario) {
            setFormData({
                nombre: horario.nombre || '',
                hora_entrada: horario.hora_entrada.slice(0, 5) || '00:00',
                hora_salida: horario.hora_salida.slice(0, 5) || '00:00',
                lunes: horario.lunes || false,
                martes: horario.martes || false,
                miercoles: horario.miercoles || false,
                jueves: horario.jueves || false,
                viernes: horario.viernes || false,
                sabado: horario.sabado || false,
                domingo: horario.domingo || false,
                cantidad_personal_requerida: horario.cantidad_personal_requerida || 1,
            });
            setFormError('');
        }
    }, [isOpen, horario]);

    if (!isOpen) return null;

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setFormError('');

        // --- Validaciones ---
        const { nombre, hora_entrada, hora_salida, cantidad_personal_requerida } = formData;
        if (!nombre || !hora_entrada || !hora_salida || !cantidad_personal_requerida) {
            setFormError("Todos los campos son obligatorios.");
            setIsSubmitting(false);
            return;
        }

        const diasSeleccionados = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'].filter(dia => formData[dia]);
        if (diasSeleccionados.length === 0) {
            setFormError("Debe seleccionar al menos un día de la semana.");
            setIsSubmitting(false);
            return;
        }
        
        const cantidadRequerida = parseInt(formData.cantidad_personal_requerida, 10);
        if (cantidadRequerida < 1) {
            setFormError("La cantidad de personal debe ser como mínimo 1.");
            setIsSubmitting(false);
            return;
        }
        if (cantidadRequerida < horario.empleados_asignados.length) {
            setFormError(`La cantidad de personal no puede ser menor a los ${horario.empleados_asignados.length} empleados ya asignados.`);
            setIsSubmitting(false);
            return;
        }

        try {
            const dataToSubmit = {
                ...formData,
                hora_entrada: `${formData.hora_entrada}:00`,
                hora_salida: `${formData.hora_salida}:00`,
                cantidad_personal_requerida: parseInt(formData.cantidad_personal_requerida, 10)
            };
            await updateHorario(horario.id, dataToSubmit);
            onUpdateSuccess();
        } catch (err) {
            setFormError('Error al actualizar el horario. Inténtalo de nuevo.');
            console.error("Error updating schedule:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg p-6 m-4" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="bg-red-100 dark:bg-red-900/20 p-2 rounded-lg">
                            <Clock className="w-5 h-5 text-red-600 dark:text-red-400" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Editar Horario</h2>
                    </div>
                    <button onClick={onClose} className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"><X size={20} /></button>
                </div>
                <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre del Horario</label>
                        <input type="text" name="nombre" value={formData.nombre} onChange={handleInputChange} className="mt-1 w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-gray-900 dark:text-white" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Hora Entrada</label>
                            <input type="time" name="hora_entrada" value={formData.hora_entrada} onChange={handleInputChange} className="mt-1 w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-gray-900 dark:text-white" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Hora Salida</label>
                            <input type="time" name="hora_salida" value={formData.hora_salida} onChange={handleInputChange} className="mt-1 w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-gray-900 dark:text-white" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Días de la semana</label>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2">
                            {['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'].map(day => (
                                <label key={day} className="flex items-center justify-center p-2 border rounded-lg cursor-pointer transition-colors duration-200 has-[:checked]:bg-red-600 has-[:checked]:border-red-600 has-[:checked]:text-white border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-red-400 dark:hover:border-red-500">
                                    <input type="checkbox" name={day} checked={formData[day] || false} onChange={handleInputChange} className="sr-only" />
                                    <span className="font-medium text-sm capitalize">{day.slice(0, 3)}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Cantidad de Personal Requerida</label>
                        <input
                            type="number"
                            name="cantidad_personal_requerida"
                            value={formData.cantidad_personal_requerida}
                            onChange={handleInputChange}
                            className="mt-1 w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-gray-900 dark:text-white" />
                    </div>
                    <div className="pt-4 flex justify-end gap-3">
                        <button type="button" onClick={onClose} disabled={isSubmitting} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 disabled:opacity-50">Cancelar</button>
                        <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-400">
                            {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    </div>
                    {formError && (
                        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 rounded-lg">
                            <div className="flex items-center gap-3">
                                <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
                                <p className="text-sm text-red-700 dark:text-red-300">{formError}</p>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

// --- Sub-componente: Modal de Confirmación de Eliminación ---
const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, isDeleting }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md p-6 m-4" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center gap-4">
                    <div className="bg-red-100 dark:bg-red-900/20 p-3 rounded-full flex-shrink-0">
                        <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Confirmar Eliminación</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">¿Estás seguro de que quieres eliminar este horario? Esta acción no se puede deshacer.</p>
                    </div>
                </div>
                <div className="mt-8 flex justify-center gap-4">
                    <button type="button" onClick={onClose} disabled={isDeleting} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 disabled:opacity-50">
                        Cancelar
                    </button>
                    <button type="button" onClick={onConfirm} disabled={isDeleting} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-400 flex items-center justify-center gap-2 w-32">
                        {isDeleting ? (
                            <>
                                <Loader className="animate-spin w-4 h-4" />
                                <span>Eliminando...</span>
                            </>
                        ) : (
                            'Eliminar'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

const VerHorariosAsignados = () => {
    const [horarios, setHorarios] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [horarioToEdit, setHorarioToEdit] = useState(null);
    
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [horarioToDelete, setHorarioToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const [successMessage, setSuccessMessage] = useState('');
    const location = useLocation();

    useEffect(() => {
        const fetchHorarios = async () => {
            try {
                setIsLoading(true);
                const response = await getHorarios();
                setHorarios(response.data);
            } catch (err) {
                setError('No se pudieron cargar los horarios. Inténtalo de nuevo más tarde.');
                console.error("Error fetching schedules:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchHorarios();
    }, []);

    useEffect(() => {
        if (location.state?.successMessage) {
            setSuccessMessage(location.state.successMessage);
            setTimeout(() => setSuccessMessage(''), 3000);
        }
    }, [location.state]);

    const handleOpenEditModal = (horario) => {
        setHorarioToEdit(horario);
        setEditModalOpen(true);
    };

    const handleOpenDeleteModal = (horario) => {
        setHorarioToDelete(horario);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!horarioToDelete) return;

        setIsDeleting(true);
        try {
            await deleteHorario(horarioToDelete.id);
            setHorarios(prev => prev.filter(h => h.id !== horarioToDelete.id));
            setSuccessMessage(`El horario "${horarioToDelete.nombre}" ha sido eliminado.`);
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            setError('Error al eliminar el horario. Es posible que tenga empleados asignados.');
            console.error("Error deleting schedule:", err);
        } finally {
            setIsDeleting(false);
            setDeleteModalOpen(false);
            setHorarioToDelete(null);
        }
    };

    const handleUpdateSuccess = () => {
        setEditModalOpen(false);
        // Refrescar la lista de horarios
        getHorarios().then(response => setHorarios(response.data))
        setSuccessMessage('Horario actualizado correctamente.');
        setTimeout(() => setSuccessMessage(''), 3000); // Oculta el mensaje después de 3 segundos
    };

    const diasSemana = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];

    if (isLoading) {
        return <div className="flex justify-center items-center p-8 text-gray-800 dark:text-gray-200"><Loader className="animate-spin mr-2" /> Cargando horarios...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center p-8 text-red-600 dark:text-red-400"><AlertTriangle className="mr-2" /> {error}</div>;
    }

    return (
        <>
            {successMessage && (
                <div className="mb-4 flex items-center gap-3 rounded-lg bg-green-100 dark:bg-green-900/20 p-4 text-sm text-green-800 dark:text-green-300 border border-green-400 dark:border-green-700">
                    <CheckCircle className="h-5 w-5" />
                    <p>{successMessage}</p>
                </div>
            )}

            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Horarios y Personal Asignado</h3>
                <div className="inline-flex items-center text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 px-3 py-1 rounded-lg">
                    <Users className="w-4 h-4 mr-2" />
                    <span>{horarios.length} Horarios Creados</span>
                </div>
            </div>

            <div className="space-y-4">
                {horarios.map((horario) => (
                    <details key={horario.id} className="group bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-300 dark:border-gray-700 hover:shadow-md transition-all duration-200">
                        <summary className="flex flex-col gap-y-2 sm:flex-row sm:justify-between sm:items-center font-medium cursor-pointer list-none">
                            <div>
                                <h4 className="font-bold text-gray-900 dark:text-white">{horario.nombre}</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {horario.hora_entrada.slice(0,5)} - {horario.hora_salida.slice(0,5)}
                                </p>
                                <div className="text-xs text-gray-500 mt-1 flex gap-2">
                                    {diasSemana.map(dia => (
                                        horario[dia] && <span key={dia} className="capitalize bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 px-2 py-0.5 rounded-full">{dia.slice(0,3)}</span>
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <button onClick={(e) => { e.stopPropagation(); handleOpenEditModal(horario); }} className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-red-600 dark:hover:text-red-500 transition-colors">
                                    <Edit className="w-4 h-4" />
                                </button>
                                <button onClick={(e) => { e.stopPropagation(); handleOpenDeleteModal(horario); }} className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-red-600 dark:hover:text-red-500 transition-colors">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                    {horario.empleados_asignados.length} / {horario.cantidad_personal_requerida}
                                    <span className="text-gray-500 dark:text-gray-400 font-normal ml-1">Asignados</span>
                                </span>
                                <span className="transition group-open:rotate-180 text-gray-500 dark:text-gray-400">
                                    <ChevronDown className="w-5 h-5" />
                                </span>
                            </div>
                        </summary>
                        <div className="mt-4 border-t pt-4 border-gray-300 dark:border-gray-600">
                            {horario.empleados_asignados.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                    {horario.empleados_asignados.map((empleado) => (
                                        <div key={empleado.id} className="flex items-center gap-3 p-3 rounded-md bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 hover:shadow-sm transition-all duration-200">
                                            <div className="h-8 w-8 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center text-red-600 dark:text-red-400">
                                                <User className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-sm text-gray-900 dark:text-white">{empleado.nombre} {empleado.apellido}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">DNI: {empleado.dni}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-6">
                                    <div className="mx-auto h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-3">
                                        <Users className="w-6 h-6 text-gray-400" />
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">No hay empleados asignados a este horario.</p>
                                </div>
                            )}
                        </div>
                    </details>
                ))}
            </div>
            <EditHorarioModal
                isOpen={isEditModalOpen}
                onClose={() => setEditModalOpen(false)}
                horario={horarioToEdit}
                onUpdateSuccess={handleUpdateSuccess}
            />
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                isDeleting={isDeleting}
            />
        </>
    );
};

export default VerHorariosAsignados;