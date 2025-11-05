import React, { useState } from 'react';
import { CalendarRange, Users, PlusCircle, History } from 'lucide-react';
import VerHorariosAsignados from './VerHorariosAsignados';
import AsignarHorario from './AsignarHorario';
import CargarHorario from './CargarHorario';
import HistorialHorarios from './HistorialHorarios';

const Horarios = () => {
    const [activeTab, setActiveTab] = useState('view-assignments');

    const tabs = [
        { id: 'view-assignments', name: 'Ver Asignaciones', icon: <CalendarRange size={16} /> },
        { id: 'assign-schedules', name: 'Asignar Horarios', icon: <Users size={16} /> },
        { id: 'create-schedule', name: 'Crear Horario', icon: <PlusCircle size={16} /> },
        { id: 'history', name: 'Historial', icon: <History size={16} /> },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'view-assignments':
                return <VerHorariosAsignados />;
            case 'assign-schedules':
                return <AsignarHorario />;
            case 'create-schedule':
                return <CargarHorario />;
            case 'history':
                return <HistorialHorarios />;
            default:
                return <VerHorariosAsignados />;
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
            <div className="border-b border-gray-200 dark:border-gray-700">
                <div className="overflow-x-auto">
                    <nav className="-mb-px flex space-x-6 px-4 sm:px-6" aria-label="Tabs">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm inline-flex items-center gap-2 transition-all duration-200 ${
                                    activeTab === tab.id
                                        ? 'border-red-500 text-red-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                                }`}
                            >
                                {tab.icon}
                                <span>{tab.name}</span>
                            </button>
                        ))}
                    </nav>
                </div>
            </div>
            <div className="p-6">
                {renderContent()}
            </div>
        </div>
    );
};

export default Horarios;