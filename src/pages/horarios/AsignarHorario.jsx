import React, { useState, useEffect } from 'react';
import { Save, Loader, AlertTriangle, CheckCircle } from 'lucide-react';
import { getHorarios, getEmpleados, updateHorarioAsignacion } from '../../services/api';

const AsignarHorario = () => {
    const [selectedScheduleId, setSelectedScheduleId] = useState('');
    const [allHorarios, setAllHorarios] = useState([]);
    const [allEmployees, setAllEmployees] = useState([]);
    const [availableEmployees, setAvailableEmployees] = useState([]);
    const [assignedEmployees, setAssignedEmployees] = useState([]);

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const [horariosRes, empleadosRes] = await Promise.all([getHorarios(), getEmpleados()]);
                setAllHorarios(horariosRes.data);
                setAllEmployees(empleadosRes.data);
            } catch (err) {
                setError('Error al cargar datos iniciales. Inténtalo de nuevo.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleScheduleChange = (e) => {
        const scheduleId = e.target.value;
        setSelectedScheduleId(scheduleId);
        setError('');
        setSuccess('');

        if (!scheduleId) {
            setAssignedEmployees([]);
            setAvailableEmployees([]);
            return;
        }

        const selected = allHorarios.find(h => h.id === parseInt(scheduleId));
        if (selected) {
            const assignedIds = new Set(selected.empleados_asignados.map(e => e.id));
            setAssignedEmployees(selected.empleados_asignados);
            setAvailableEmployees(allEmployees.filter(e => !assignedIds.has(e.id)));
        }
    };

    const assignEmployee = (employee) => {
        setAvailableEmployees(availableEmployees.filter(e => e.id !== employee.id));
        setAssignedEmployees([...assignedEmployees, employee].sort((a, b) => a.apellido.localeCompare(b.apellido)));
    };

    const unassignEmployee = (employee) => {
        setAssignedEmployees(assignedEmployees.filter(e => e.id !== employee.id));
        setAvailableEmployees([...availableEmployees, employee].sort((a, b) => a.apellido.localeCompare(b.apellido)));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedScheduleId) {
            setError("Debes seleccionar un horario antes de guardar.");
            return;
        }

        setIsSaving(true);
        setError('');
        setSuccess('');

        const dataToSend = {
            id_horario: parseInt(selectedScheduleId, 10),
            empleado_ids: assignedEmployees.map(e => e.id)
        };

        try {
            await updateHorarioAsignacion(dataToSend);
            setSuccess('Asignación guardada correctamente.');
            // Opcional: Recargar los datos para reflejar el estado guardado
            const updatedHorarios = await getHorarios();
            setAllHorarios(updatedHorarios.data);
        } catch (err) {
            setError('Error al guardar la asignación. Inténtalo de nuevo.');
            console.error("Error saving assignment:", err);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Asignar Empleados a un Horario</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Selecciona un horario y arrastra los empleados para asignarlos.</p>
            </div>

            {success && (
                <div className="mb-4 flex items-center gap-3 rounded-lg bg-green-50 dark:bg-green-900/20 p-4 text-sm text-green-700 dark:text-green-300">
                    <CheckCircle className="h-5 w-5" />
                    <p>{success}</p>
                </div>
            )}
            {error && (
                <div className="mb-4 flex items-center gap-3 rounded-lg bg-red-50 dark:bg-red-900/20 p-4 text-sm text-red-700 dark:text-red-300">
                    <AlertTriangle className="h-5 w-5" />
                    <p>{error}</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                    <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">1. Seleccionar Horario</label>
                    <select 
                        value={selectedScheduleId}
                        onChange={handleScheduleChange}
                        disabled={isLoading || isSaving}
                        className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-gray-900 dark:text-white"
                    >
                        <option value="">Seleccionar...</option>
                        {allHorarios.map(horario => (
                            <option key={horario.id} value={horario.id}>
                                {horario.nombre} ({horario.hora_entrada.slice(0,5)} - {horario.hora_salida.slice(0,5)})
                            </option>
                        ))}
                    </select>
                </div>

                {selectedScheduleId && (
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">2. Asignar Empleados</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                                <h4 className="text-sm font-semibold mb-3 text-gray-900 dark:text-white">Empleados Disponibles</h4>
                                <div className="bg-white dark:bg-gray-800 rounded-lg p-2 min-h-[20rem] max-h-[20rem] overflow-y-auto border dark:border-gray-600">
                                    {availableEmployees.map(emp => (
                                        <div key={emp.id} onClick={() => !isSaving && assignEmployee(emp)} className={`flex items-center gap-3 p-2 rounded-md ${isSaving ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                                            <span className="text-sm font-medium text-gray-900 dark:text-white">{emp.nombre} {emp.apellido}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                                <h4 className="text-sm font-semibold mb-3 text-gray-900 dark:text-white">
                                    Empleados Asignados ({assignedEmployees.length})
                                </h4>
                                <div className="bg-white dark:bg-gray-800 rounded-lg p-2 min-h-[20rem] max-h-[20rem] overflow-y-auto border dark:border-gray-600">
                                    {assignedEmployees.map(emp => (
                                        <div key={emp.id} onClick={() => !isSaving && unassignEmployee(emp)} className={`flex items-center gap-3 p-2 rounded-md ${isSaving ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                                            <span className="text-sm font-medium text-gray-900 dark:text-white">{emp.nombre} {emp.apellido}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 flex justify-end">
                            <button type="submit" disabled={isSaving} className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-400">
                                {isSaving ? <Loader className="animate-spin" size={16} /> : <Save size={16} />}
                                <span>{isSaving ? 'Guardando...' : 'Guardar Asignación'}</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </form>
    );
};

export default AsignarHorario;