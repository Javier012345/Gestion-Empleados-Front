import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, UserCheck, ShieldAlert, UserPlus, Wrench, FileWarning, Bell, LogIn } from 'lucide-react';
import { Line, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    ArcElement,
} from 'chart.js';

// Registrar los componentes de Chart.js que vamos a utilizar
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    ArcElement
);

const Home = () => {
    // Estado para almacenar los datos del dashboard (simulados)
    const [dashboardData, setDashboardData] = useState({
        total_empleados: 0,
        asistencia_hoy: 0,
        sanciones_mes: 0,
        contrataciones_mes: 0,
        hires_labels: [],
        hires_data: [],
        status_labels: [],
        status_data: [],
        ultimos_incidentes: [],
        actividad_reciente: [],
    });

    useEffect(() => {
        // Simulación de la carga de datos desde la API
        const fetchData = () => {
            setDashboardData({
                total_empleados: 125,
                asistencia_hoy: 110,
                sanciones_mes: 5,
                contrataciones_mes: 8,
                hires_labels: ['Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre'],
                hires_data: [5, 7, 6, 8, 7, 8],
                status_labels: ['Activo', 'Inactivo', 'Licencia'],
                status_data: [115, 8, 2],
                ultimos_incidentes: [
                    { id: 1, tipo: 'Conflicto', empleado: 'Juan Pérez' },
                    { id: 2, tipo: 'Fallo Técnico', empleado: 'Ana Gómez' },
                    { id: 3, tipo: 'Amonestación', empleado: 'Carlos Ruiz' },
                ],
                actividad_reciente: [
                    { id: 1, mensaje: '¡Bienvenido, nuevo empleado!', time: 'hace 5m' },
                    { id: 2, mensaje: 'Se ha registrado una nueva asistencia.', time: 'hace 10m' },
                    { id: 3, mensaje: 'Nuevo incidente reportado.', time: 'hace 1h' },
                    { id: 4, mensaje: 'Actualización de perfil.', time: 'hace 3h' },
                ],
            });
        };
        fetchData();
    }, []);

    // --- Configuraciones de Gráficos ---
    const hiresChartData = {
        labels: dashboardData.hires_labels,
        datasets: [{
            label: 'Nuevos Empleados',
            data: dashboardData.hires_data,
            borderColor: '#D9232D',
            backgroundColor: 'rgba(217, 35, 45, 0.1)',
            fill: true,
            tension: 0.4,
        }],
    };

    const hiresChartOptions = {
        responsive: true,
        scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } }, x: { grid: { display: false } } },
        plugins: { legend: { display: false } },
    };

    const statusChartData = {
        labels: dashboardData.status_labels,
        datasets: [{
            data: dashboardData.status_data,
            backgroundColor: ['#10B981', '#F59E0B', '#6B7280'],
            borderColor: '#ffffff', // Simula el color de fondo para el borde
            borderWidth: 4,
        }],
    };

    const statusChartOptions = {
        responsive: true,
        cutout: '70%',
        plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, padding: 20 } } },
    };

    const getIncidentIcon = (type) => {
        if (type.includes('Conflicto')) return <Users className="w-6 h-6" />;
        if (type.includes('Fallo')) return <Wrench className="w-6 h-6" />;
        return <FileWarning className="w-6 h-6" />;
    };

    const getActivityIcon = (message) => {
        if (message.includes('Bienvenido')) return <UserPlus className="w-5 h-5" />;
        if (message.includes('asistencia')) return <LogIn className="w-5 h-5" />;
        if (message.includes('incidente')) return <ShieldAlert className="w-5 h-5" />;
        return <Bell className="w-5 h-5" />;
    };

    return (
        <div className="p-6 bg-transparent min-h-screen"> {/* Cambiado a bg-transparent */}

            {/* Tarjetas de Estadísticas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Link to="/empleados" className="relative overflow-hidden bg-gradient-to-br from-red-500 to-red-600 p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-semibold text-white">Total Empleados</h3>
                            <div className="p-2 bg-white/20 rounded-lg"><Users className="w-6 h-6 text-white" /></div>
                        </div>
                        <p className="text-4xl font-bold text-white">{dashboardData.total_empleados}</p>
                    </div>
                </Link>
                 <a href="#" className="relative overflow-hidden bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-semibold text-white">Asistencia Hoy</h3>
                            <div className="p-2 bg-white/20 rounded-lg"><UserCheck className="w-6 h-6 text-white" /></div>
                        </div>
                        <p className="text-4xl font-bold text-white">{dashboardData.asistencia_hoy} / {dashboardData.total_empleados}</p>
                    </div>
                </a>
                <a href="#" className="relative overflow-hidden bg-gradient-to-br from-amber-500 to-amber-600 p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-semibold text-white">Sanciones Mes</h3>
                            <div className="p-2 bg-white/20 rounded-lg"><ShieldAlert className="w-6 h-6 text-white" /></div>
                        </div>
                        <p className="text-4xl font-bold text-white">{dashboardData.sanciones_mes}</p>
                    </div>
                </a>
                <a href="#" className="relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-semibold text-white">Contrataciones (Mes)</h3>
                            <div className="p-2 bg-white/20 rounded-lg"><UserPlus className="w-6 h-6 text-white" /></div>
                        </div>
                        <p className="text-4xl font-bold text-white">{dashboardData.contrataciones_mes}</p>
                    </div>
                </a>
            </div>

            {/* Grid para Gráficos y Listas */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg"> {/* Añadido dark mode */}
                        <h2 className="text-lg font-bold mb-6 text-blue-500">Contrataciones en los últimos 6 meses</h2>
                        <div className="bg-white dark:bg-gray-700/50 p-4 rounded-xl">
                            <Line options={hiresChartOptions} data={hiresChartData} />
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg"> {/* Añadido dark mode */}
                        <h2 className="text-lg font-bold mb-6 text-red-500">Últimos Incidentes Registrados</h2>
                        <ul className="space-y-4">
                            {dashboardData.ultimos_incidentes.map(incidente => (
                                <li key={incidente.id} className="flex items-center gap-4 p-4 bg-white dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-700 transition duration-300 hover:border-gray-300 dark:hover:border-gray-600">
                                    <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg">
                                        {getIncidentIcon(incidente.tipo)}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-sm text-gray-800 dark:text-gray-100">{incidente.tipo}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Involucra a: {incidente.empleado}</p>
                                    </div>
                                    <a href="#" className="text-xs font-semibold px-3 py-1 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors duration-300">Ver</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="lg:col-span-1 space-y-8">
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg"> {/* Añadido dark mode */}
                        <h2 className="text-lg font-bold mb-6 text-purple-500">Empleados por Estado</h2>
                        <div className="bg-white dark:bg-gray-700/50 p-4 rounded-xl">
                            <Doughnut options={statusChartOptions} data={statusChartData} />
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg"> {/* Añadido dark mode */}
                        <h2 className="text-lg font-bold mb-6 text-green-500">Actividad Reciente</h2>
                        <ul className="space-y-4">
                            {dashboardData.actividad_reciente.map(actividad => (
                                <li key={actividad.id} className="flex items-center gap-4 p-4 bg-white dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-700 transition duration-300 hover:border-gray-300 dark:hover:border-gray-600">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-gray-500 to-gray-600 text-white shadow-lg">
                                        {getActivityIcon(actividad.mensaje)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-gray-900 dark:text-gray-100 truncate">{actividad.mensaje}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{actividad.time}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
