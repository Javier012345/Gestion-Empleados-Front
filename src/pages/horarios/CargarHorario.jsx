import React, { useState } from 'react';
import { Clock, Settings } from 'lucide-react';

const CargarHorario = () => {
    const [activeTab, setActiveTab] = useState('preset');

    return (
        <div>
            <div className="mb-6 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
                <nav className="flex space-x-4" aria-label="Tabs">
                    <button 
                        onClick={() => setActiveTab('preset')}
                        className={`group flex items-center gap-2 py-3 px-4 border-b-2 font-medium text-sm transition-all duration-200 ${
                            activeTab === 'preset' ? 'border-red-500 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}>
                        <Clock size={16} />
                        <span>Desde Plantilla</span>
                    </button>
                    <button 
                        onClick={() => setActiveTab('custom')}
                        className={`group flex items-center gap-2 py-3 px-4 border-b-2 font-medium text-sm transition-all duration-200 ${
                            activeTab === 'custom' ? 'border-red-500 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}>
                        <Settings size={16} />
                        <span>Personalizado</span>
                    </button>
                </nav>
            </div>

            {activeTab === 'preset' && (
                <div className="max-w-md mx-auto">
                    <div className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/10 dark:to-red-900/20 p-4 rounded-lg mb-6">
                        <h3 className="text-lg font-semibold mb-2 text-red-800 dark:text-red-200">Crear Horario desde Plantilla</h3>
                        <p className="text-sm text-red-600 dark:text-red-300">Crea rápidamente los turnos comunes de mañana o tarde.</p>
                    </div>
                    <form className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Turno</label>
                            <select className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-gray-900 dark:text-white">
                                <option>Turno Mañana</option>
                                <option>Turno Tarde</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Cantidad de Personal Requerida</label>
                            <input type="number" className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-gray-900 dark:text-white" />
                        </div>
                        <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 mt-4">Crear Horario</button>
                    </form>
                </div>
            )}

            {activeTab === 'custom' && (
                <div className="max-w-2xl mx-auto">
                     <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/10 dark:to-blue-900/20 p-4 rounded-lg mb-6">
                        <h3 className="text-lg font-semibold mb-2 text-blue-800 dark:text-blue-200">Crear Horario Personalizado</h3>
                        <p className="text-sm text-blue-600 dark:text-blue-300">Define un horario con horas y días específicos.</p>
                    </div>
                    <form className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre</label>
                            <input type="text" className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-gray-900 dark:text-white" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Hora Entrada</label>
                                <input type="time" className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-gray-900 dark:text-white" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Hora Salida</label>
                                <input type="time" className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-gray-900 dark:text-white" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Días de la semana</label>
                            <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
                                {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map(day => (
                                    <label key={day} className="flex items-center justify-center gap-2 p-3 border rounded-lg dark:border-gray-600 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 has-[:checked]:bg-red-50 has-[:checked]:border-red-300 dark:has-[:checked]:bg-red-900/20 dark:has-[:checked]:border-red-700">
                                        <input type="checkbox" className="form-checkbox h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500" />
                                        <span className="font-medium text-gray-900 dark:text-white">{day}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Cantidad de Personal Requerida</label>
                            <input type="number" className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-gray-900 dark:text-white" />
                        </div>
                        <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">Guardar Horario Personalizado</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default CargarHorario;