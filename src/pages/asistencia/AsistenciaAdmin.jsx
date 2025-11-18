import React, { useState } from 'react';
import MarcarAsistenciaTab from './MarcarAsistenciaTab';
import ModificarRostroTab from './ModificarRostroTab';
import RegistrarRostroTab from './RegistrarRostroTab';
import VerAsistenciasTab from './VerAsistenciasTab';

const AsistenciaAdmin = () => {
    const [activeTab, setActiveTab] = useState('registrar-asistencia');

    const handleTabClick = (tabId) => {
        setActiveTab(tabId);
    };

    return (
        <div className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white p-4 rounded-lg">
            <h1 className="text-2xl mb-4">Gestión de Asistencia</h1>
            <div className="bg-white dark:bg-gray-700 rounded-xl shadow-sm">
                <div className="border-b border-gray-200 dark:border-gray-600">
                    <nav className="-mb-px flex space-x-6 px-6 overflow-x-auto" aria-label="Tabs">
                        <a
                            href="#registrar-rostro"
                            onClick={() => handleTabClick('registrar-rostro')}
                            className={`attendance-tab tab whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'registrar-rostro' ? 'border-blue-500 text-blue-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500'}`}
                        >
                            Registrar Rostro
                        </a>
                        <a
                            href="#modificar-rostro"
                            onClick={() => handleTabClick('modificar-rostro')}
                            className={`attendance-tab tab whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'modificar-rostro' ? 'border-blue-500 text-blue-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500'}`}
                        >
                            Modificar Rostro
                        </a>
                        <a
                            href="#registrar-asistencia"
                            onClick={() => handleTabClick('registrar-asistencia')}
                            className={`attendance-tab tab whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'registrar-asistencia' ? 'border-blue-500 text-blue-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500'}`}
                        >
                            Registrar Asistencia
                        </a>
                        <a
                            href="#ver-asistencias"
                            onClick={() => handleTabClick('ver-asistencias')}
                            className={`attendance-tab tab whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'ver-asistencias' ? 'border-blue-500 text-blue-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500'}`}
                        >
                            Ver Asistencias
                        </a>
                    </nav>
                </div>
                <div className="p-6">
                    <div id="registrar-asistencia-tab" className={`attendance-tab-content ${activeTab !== 'registrar-asistencia' ? 'hidden' : ''}`}>
                        <MarcarAsistenciaTab />
                    </div>
                    <div id="registrar-rostro-tab" className={`attendance-tab-content ${activeTab !== 'registrar-rostro' ? 'hidden' : ''}`}>
                        <RegistrarRostroTab />
                    </div>
                    <div id="modificar-rostro-tab" className={`attendance-tab-content ${activeTab !== 'modificar-rostro' ? 'hidden' : ''}`}>
                        <ModificarRostroTab />
                    </div>
                    <div id="ver-asistencias-tab" className={`attendance-tab-content ${activeTab !== 'ver-asistencias' ? 'hidden' : ''}`}>
                        <VerAsistenciasTab />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AsistenciaAdmin;