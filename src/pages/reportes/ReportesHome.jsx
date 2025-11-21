
import React, { useState, useEffect } from 'react';
import * as api from '../../services/api';
import ReporteEstadoEmpleados from './ReporteEstadoEmpleados';
import ReporteSancionesPorTipo from './ReporteSancionesPorTipo';
import ReporteIncidentesPorTipo from './ReporteIncidentesPorTipo';

const ReportesHome = () => {
    const [selectedReport, setSelectedReport] = useState('estado_empleados');
    const [sancionesData, setSancionesData] = useState(null);
    const [incidentesData, setIncidentesData] = useState(null);
    const [empleadosData, setEmpleadosData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                const [sancionesRes, incidentesRes, empleadosRes] = await Promise.all([
                    api.getSancionesEmpleados(),
                    api.getIncidentesAgrupados(),
                    api.getEmpleadosBasico()
                ]);

                console.log('Datos de Sanciones recibidos:', sancionesRes.data);
                console.log('Datos de Incidentes recibidos:', incidentesRes.data);
                console.log('Datos de Empleados recibidos:', empleadosRes.data);

                // Procesar sanciones por tipo
                const sancionesCounts = sancionesRes.data.reduce((acc, sancion) => {
                    const tipo = sancion.id_sancion?.tipo || 'Sin Tipo';
                    acc[tipo] = (acc[tipo] || 0) + 1;
                    return acc;
                }, {});
                setSancionesData({
                    labels: Object.keys(sancionesCounts),
                    values: Object.values(sancionesCounts)
                });

                // Procesar incidentes por tipo
                const incidentesCounts = incidentesRes.data.reduce((acc, incidente) => {
                    // Usamos encadenamiento opcional (?.) para evitar errores si id_incidente no existe.
                    const tipo = incidente.incidente?.tipo_incid || 'Sin Tipo';
                    acc[tipo] = (acc[tipo] || 0) + 1;
                    return acc;
                }, {});
                setIncidentesData({
                    labels: Object.keys(incidentesCounts),
                    values: Object.values(incidentesCounts)
                });

                // Procesar empleados por estado
                const empleadosCounts = empleadosRes.data.reduce((acc, empleado) => {
                    const estado = empleado?.estado || 'Sin Estado';
                    acc[estado] = (acc[estado] || 0) + 1;
                    return acc;
                }, {});
                setEmpleadosData({
                    labels: Object.keys(empleadosCounts),
                    values: Object.values(empleadosCounts)
                });

            } catch (err) {
                setError('Error al cargar los datos para los reportes.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const renderReport = () => {
        if (loading) return <p className="text-gray-400">Cargando datos...</p>;
        if (error) return <p className="text-red-500">{error}</p>;

        switch (selectedReport) {
            case 'estado_empleados':
                return <ReporteEstadoEmpleados data={empleadosData} />;
            case 'sanciones_tipo':
                return <ReporteSancionesPorTipo data={sancionesData} />;
            case 'incidentes_tipo':
                return <ReporteIncidentesPorTipo data={incidentesData} />;
            default:
                return <ReporteEstadoEmpleados data={empleadosData} />;
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
        <div className="max-w-7xl mx-auto space-y-8 text-gray-900 dark:text-white">
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 lg:order-1">
                    <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3">Seleccionar Reporte</h2>
                    <div id="report-cards" className="space-y-4">
                        <div 
                            className={`report-card cursor-pointer p-4 rounded-lg transition-all duration-200 border ${selectedReport === 'estado_empleados' ? 'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700' : 'bg-gray-100 dark:bg-gray-700/50 hover:bg-red-100/50 dark:hover:bg-red-900/20 border-transparent'}`}
                            onClick={() => setSelectedReport('estado_empleados')}
                        >
                            <p className="font-semibold text-gray-800 dark:text-gray-200">Estado de Empleados</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Activos, Inactivos, etc.</p>
                        </div>
                        <div 
                            className={`report-card cursor-pointer p-4 rounded-lg transition-all duration-200 border ${selectedReport === 'sanciones_tipo' ? 'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700' : 'bg-gray-100 dark:bg-gray-700/50 hover:bg-red-100/50 dark:hover:bg-red-900/20 border-transparent'}`}
                            onClick={() => setSelectedReport('sanciones_tipo')}
                        >
                            <p className="font-semibold text-gray-800 dark:text-gray-200">Sanciones por Tipo</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Leves, Moderadas, Graves.</p>
                        </div>
                        <div 
                            className={`report-card cursor-pointer p-4 rounded-lg transition-all duration-200 border ${selectedReport === 'incidentes_tipo' ? 'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700' : 'bg-gray-100 dark:bg-gray-700/50 hover:bg-red-100/50 dark:hover:bg-red-900/20 border-transparent'}`}
                            onClick={() => setSelectedReport('incidentes_tipo')}
                        >
                            <p className="font-semibold text-gray-800 dark:text-gray-200">Incidentes por Tipo</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Conducta, Seguridad, etc.</p>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 lg:order-2">
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
