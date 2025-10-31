import React, { useState } from 'react';
import MarcarAsistenciaTab from './MarcarAsistenciaTab';
import ModificarRostroTab from './ModificarRostroTab';
import RegistrarRostroTab from './RegistrarRostroTab';
import VerAsistenciasTab from './VerAsistenciasTab';

const AsistenciaAdmin = () => {
    const [activeTab, setActiveTab] = useState('register-attendance');

    const handleTabClick = (tabId) => {
        setActiveTab(tabId);
    };

    return (
        <div className="bg-gray-800 text-white p-4 rounded-lg">
            <h1 className="text-2xl mb-4">Gestión de Asistencia</h1>
            <div className="bg-gray-700 rounded-xl shadow-sm">
                <div className="border-b border-gray-600">
                    <nav className="-mb-px flex space-x-6 px-6 overflow-x-auto" aria-label="Tabs">
                        <a
                            href="#register-face"
                            onClick={() => handleTabClick('register-face')}
                            className={`attendance-tab tab whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'register-face' ? 'border-blue-500 text-blue-400' : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-500'}`}
                        >
                            Registrar Rostro
                        </a>
                        <a
                            href="#modify-face"
                            onClick={() => handleTabClick('modify-face')}
                            className={`attendance-tab tab whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'modify-face' ? 'border-blue-500 text-blue-400' : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-500'}`}
                        >
                            Modificar Rostro
                        </a>
                        <a
                            href="#register-attendance"
                            onClick={() => handleTabClick('register-attendance')}
                            className={`attendance-tab tab whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'register-attendance' ? 'border-blue-500 text-blue-400' : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-500'}`}
                        >
                            Registrar Asistencia
                        </a>
                        <a
                            href="#view-attendances"
                            onClick={() => handleTabClick('view-attendances')}
                            className={`attendance-tab tab whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'view-attendances' ? 'border-blue-500 text-blue-400' : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-500'}`}
                        >
                            Ver Asistencias
                        </a>
                    </nav>
                </div>
                <div className="p-6">
                    <div id="register-attendance-tab" className={`attendance-tab-content ${activeTab !== 'register-attendance' ? 'hidden' : ''}`}>
                        <MarcarAsistenciaTab />
                    </div>
                    <div id="register-face-tab" className={`attendance-tab-content ${activeTab !== 'register-face' ? 'hidden' : ''}`}>
                        <RegistrarRostroTab />
                    </div>
                    <div id="modify-face-tab" className={`attendance-tab-content ${activeTab !== 'modify-face' ? 'hidden' : ''}`}>
                        <ModificarRostroTab />
                    </div>
                    <div id="view-attendances-tab" className={`attendance-tab-content ${activeTab !== 'view-attendances' ? 'hidden' : ''}`}>
                        <VerAsistenciasTab />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AsistenciaAdmin;