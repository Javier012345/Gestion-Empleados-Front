import React, { useState } from 'react';
import { Save } from 'lucide-react';

const AsignarHorario = () => {
    const [selectedSchedule, setSelectedSchedule] = useState('');
    const [availableEmployees, setAvailableEmployees] = useState([
        { id: 1, nombre: 'Juan', apellido: 'Perez' },
        { id: 2, nombre: 'Maria', apellido: 'Gomez' },
        { id: 3, nombre: 'Carlos', apellido: 'Lopez' },
    ]);
    const [assignedEmployees, setAssignedEmployees] = useState([]);

    const horarios = [
        { id: 1, nombre: 'Turno Mañana', hora_entrada: '08:00', hora_salida: '16:00' },
        { id: 2, nombre: 'Turno Tarde', hora_entrada: '16:00', hora_salida: '00:00' },
        { id: 3, nombre: 'Fin de Semana', hora_entrada: '09:00', hora_salida: '17:00' },
    ];

    const handleScheduleChange = (e) => {
        setSelectedSchedule(e.target.value);
        // Here you would fetch employees for the selected schedule
    };

    const assignEmployee = (employee) => {
        setAvailableEmployees(availableEmployees.filter(e => e.id !== employee.id));
        setAssignedEmployees([...assignedEmployees, employee]);
    };

    const unassignEmployee = (employee) => {
        setAssignedEmployees(assignedEmployees.filter(e => e.id !== employee.id));
        setAvailableEmployees([...availableEmployees, employee]);
    };

    return (
        <form>
            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Asignar Empleados a un Horario</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Selecciona un horario y arrastra los empleados para asignarlos.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                    <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">1. Seleccionar Horario</label>
                    <select 
                        value={selectedSchedule}
                        onChange={handleScheduleChange}
                        className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-gray-900 dark:text-white"
                    >
                        <option value="">Seleccionar...</option>
                        {horarios.map(horario => (
                            <option key={horario.id} value={horario.id}>
                                {horario.nombre} ({horario.hora_entrada} - {horario.hora_salida})
                            </option>
                        ))}
                    </select>
                </div>

                {selectedSchedule && (
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">2. Asignar Empleados</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                                <h4 className="text-sm font-semibold mb-3 text-gray-900 dark:text-white">Empleados Disponibles</h4>
                                <div className="bg-white dark:bg-gray-800 rounded-lg p-2 min-h-[20rem] max-h-[20rem] overflow-y-auto border dark:border-gray-600">
                                    {availableEmployees.map(emp => (
                                        <div key={emp.id} onClick={() => assignEmployee(emp)} className="flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                                            <span className="text-sm font-medium text-gray-900 dark:text-white">{emp.nombre} {emp.apellido}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                                <h4 className="text-sm font-semibold mb-3 text-gray-900 dark:text-white">Empleados Asignados</h4>
                                <div className="bg-white dark:bg-gray-800 rounded-lg p-2 min-h-[20rem] max-h-[20rem] overflow-y-auto border dark:border-gray-600">
                                    {assignedEmployees.map(emp => (
                                        <div key={emp.id} onClick={() => unassignEmployee(emp)} className="flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                                            <span className="text-sm font-medium text-gray-900 dark:text-white">{emp.nombre} {emp.apellido}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 flex justify-end">
                            <button type="submit" className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                                <Save size={16} />
                                <span>Guardar Asignación</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </form>
    );
};

export default AsignarHorario;