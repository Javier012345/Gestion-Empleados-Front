
import React, { useState } from 'react';
import ReporteEstadoEmpleados from './ReporteEstadoEmpleados';
import ReporteSancionesPorTipo from './ReporteSancionesPorTipo';
import ReporteIncidentesPorTipo from './ReporteIncidentesPorTipo';

const ReportesHome = () => {
    const [selectedReport, setSelectedReport] = useState('estado_empleados');

    const renderReport = () => {
        switch (selectedReport) {
            case 'estado_empleados':
                return <ReporteEstadoEmpleados />;
            case 'sanciones_tipo':
                return <ReporteSancionesPorTipo />;
            case 'incidentes_tipo':
                return <ReporteIncidentesPorTipo />;
            default:
                return <ReporteEstadoEmpleados />;
        }
    };

    const getTitle = () => {
        switch (selectedReport) {
            case 'estado_empleados':
                return 'Distribución de Empleados por Estado';
            case 'sanciones_tipo':
                return 'Distribución de Sanciones por Tipo';
            case 'incidentes_tipo':
                return 'Distribución de Incidentes por Tipo';
            default:
                return 'Distribución de Empleados por Estado';
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 text-white">
            <h1 className="text-2xl font-bold">Dashboard de Reportes Dinámico</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-700 lg:order-1">
                    <h2 className="text-lg font-semibold mb-4 text-white border-b border-gray-700 pb-3">Seleccionar Reporte</h2>
                    <div id="report-cards" className="space-y-4">
                        <div 
                            className={`report-card cursor-pointer p-4 rounded-lg transition-all duration-200 border ${selectedReport === 'estado_empleados' ? 'bg-red-900/30 border-red-700' : 'bg-gray-700/50 hover:bg-red-900/20 border-transparent'}`}
                            onClick={() => setSelectedReport('estado_empleados')}
                        >
                            <p className="font-semibold text-gray-200">Estado de Empleados</p>
                            <p className="text-xs text-gray-400">Activos, Inactivos, etc.</p>
                        </div>
                        <div 
                            className={`report-card cursor-pointer p-4 rounded-lg transition-all duration-200 border ${selectedReport === 'sanciones_tipo' ? 'bg-red-900/30 border-red-700' : 'bg-gray-700/50 hover:bg-red-900/20 border-transparent'}`}
                            onClick={() => setSelectedReport('sanciones_tipo')}
                        >
                            <p className="font-semibold text-gray-200">Sanciones por Tipo</p>
                            <p className="text-xs text-gray-400">Leves, Moderadas, Graves.</p>
                        </div>
                        <div 
                            className={`report-card cursor-pointer p-4 rounded-lg transition-all duration-200 border ${selectedReport === 'incidentes_tipo' ? 'bg-red-900/30 border-red-700' : 'bg-gray-700/50 hover:bg-red-900/20 border-transparent'}`}
                            onClick={() => setSelectedReport('incidentes_tipo')}
                        >
                            <p className="font-semibold text-gray-200">Incidentes por Tipo</p>
                            <p className="text-xs text-gray-400">Conducta, Seguridad, etc.</p>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2 bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-700 lg:order-2">
                    <h2 className="text-lg font-bold bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent mb-2 sm:mb-0">{getTitle()}</h2>
                    <div className="h-96 w-full flex items-center justify-center relative">
                        {renderReport()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportesHome;
