import React, { useState, useEffect, useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import { Link } from 'react-router-dom';
import { getEmpleadosBasico, getSancionesEmpleados, getIncidentesAgrupados, getResumenDiario } from '../../services/api';
import { Users, UserCheck, ShieldAlert, UserPlus, Wrench, FileWarning, Bell, LogIn } from 'lucide-react';
import { Line, Doughnut } from 'react-chartjs-2';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
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
    const { theme } = useContext(ThemeContext);
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState({
        total_empleados: 0,
        asistencia_hoy: 0,
        total_empleados_activos: 0,
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
        const fetchData = async () => {
            try {
                setLoading(true);
                const [empleadosRes, sancionesRes, incidentesRes, resumenDiarioRes] = await Promise.all([
                    getEmpleadosBasico(),
                    getSancionesEmpleados(),
                    getIncidentesAgrupados(),
                    getResumenDiario(),
                ]);

                const empleados = empleadosRes.data;
                const sanciones = sancionesRes.data;
                const incidentes = incidentesRes.data;
                const resumenDiario = resumenDiarioRes.data;

                // Log para verificar la respuesta del resumen diario
                console.log("Resumen diario recibido:", resumenDiario);

                // --- Procesamiento de Datos ---
                const now = new Date();
                const currentMonth = now.getMonth();
                const currentYear = now.getFullYear();

                // Contrataciones del mes
                const contrataciones_mes = empleados.filter(e => {
                    const fechaIngreso = new Date(e.fecha_ingreso);
                    return fechaIngreso.getMonth() === currentMonth && fechaIngreso.getFullYear() === currentYear;
                }).length;

                // Sanciones del mes
                const sanciones_mes = sanciones.filter(s => {
                    const fechaSancion = new Date(s.fecha_sancion);
                    return fechaSancion.getMonth() === currentMonth && fechaSancion.getFullYear() === currentYear;
                }).length;

                // Gráfico de contrataciones (últimos 6 meses)
                const hiresData = Array(6).fill(0);
                const hiresLabels = [];
                for (let i = 5; i >= 0; i--) {
                    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
                    hiresLabels.push(d.toLocaleString('es-ES', { month: 'long' }));
                    empleados.forEach(e => {
                        const fechaIngreso = new Date(e.fecha_ingreso);
                        if (fechaIngreso.getMonth() === d.getMonth() && fechaIngreso.getFullYear() === d.getFullYear()) {
                            hiresData[5 - i]++;
                        }
                    });
                }

                // Gráfico de estado de empleados
                const statusCounts = empleados.reduce((acc, e) => {
                    acc[e.estado] = (acc[e.estado] || 0) + 1;
                    return acc;
                }, {});
                const status_labels = Object.keys(statusCounts);
                const status_data = Object.values(statusCounts);

                // --- Actividad Reciente (generada desde datos existentes) ---
                const ultimasContrataciones = empleados
                    .sort((a, b) => new Date(b.fecha_ingreso) - new Date(a.fecha_ingreso))
                    .slice(0, 3)
                    .map(e => ({
                        id: `emp-${e.id}`,
                        tipo: 'NUEVA_CONTRATACION',
                        mensaje: `¡Bienvenido, ${e.nombre} ${e.apellido}!`,
                        fecha: new Date(e.fecha_ingreso)
                    }));

                const ultimasSanciones = sanciones
                    .sort((a, b) => new Date(b.fecha_sancion) - new Date(a.fecha_sancion))
                    .slice(0, 3)
                    .map(s => ({
                        id: `san-${s.id}`,
                        tipo: 'NUEVA_SANCION',
                        mensaje: `Se aplicó una sanción a ${s.id_empl.nombre} ${s.id_empl.apellido}.`,
                        fecha: new Date(s.fecha_sancion)
                    }));

                const actividadReciente = [...ultimasContrataciones, ...ultimasSanciones]
                    .sort((a, b) => b.fecha - a.fecha)
                    .slice(0, 5);

                setDashboardData({
                    total_empleados: empleados.length,
                    asistencia_hoy: resumenDiario.asistencias_hoy,
                    total_empleados_activos: resumenDiario.total_empleados_activos,
                    sanciones_mes: sanciones_mes,
                    contrataciones_mes: contrataciones_mes,
                    hires_labels: hiresLabels,
                    hires_data: hiresData,
                    status_labels: status_labels,
                    status_data: status_data,
                    ultimos_incidentes: incidentes.slice(0, 5).map(inc => ({
                        id: inc.grupo_incidente, // Usamos el grupo_incidente como ID único
                        tipo: inc.incidente?.tipo_incid,
                        empleado: inc.empleados_involucrados.map(e => `${e.nombre} ${e.apellido}`).join(', ') || 'No especificado'
                    })),
                    actividad_reciente: actividadReciente,
                });
            } catch (error) {
                console.error("Error al cargar los datos del dashboard:", error);
            } finally {
                setLoading(false);
            }
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
            backgroundColor: theme === 'dark' ? 'rgba(217, 35, 45, 0.3)' : 'rgba(217, 35, 45, 0.1)',
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
            borderColor: 'transparent', // Simula el color de fondo para el borde
            borderWidth: 4,
        }],
    };

    const statusChartOptions = {
        responsive: true,
        cutout: '70%',
        plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, padding: 20 } } },
    };

    const getIncidentIcon = (type) => {
        if (type && type.includes('Conflicto')) return <Users className="w-6 h-6" />;
        if (type && type.includes('Fallo')) return <Wrench className="w-6 h-6" />;
        return <FileWarning className="w-6 h-6" />;
    };

    const getActivityIcon = (type) => {
        if (type === 'NUEVA_CONTRATACION') return <UserPlus className="w-5 h-5" />;
        if (type === 'NUEVA_SANCION') return <ShieldAlert className="w-5 h-5" />;
        return <Bell className="w-5 h-5" />;
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen"><p>Cargando datos del dashboard...</p></div>;
    }

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
                        <p className="text-4xl font-bold text-white">{dashboardData.asistencia_hoy} / {dashboardData.total_empleados_activos}</p>
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
                                <li key={incidente.id} className="flex items-center gap-4 p-4 bg-white dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-700 transition duration-300 hover:border-red-300 dark:hover:border-red-600">
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
                                <li key={actividad.id} className="flex items-center gap-4 p-4 bg-white dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-700 transition duration-300 hover:border-green-300 dark:hover:border-green-600">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-gray-500 to-gray-600 text-white shadow-lg">
                                        {getActivityIcon(actividad.tipo)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-gray-900 dark:text-gray-100 truncate">{actividad.mensaje}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {formatDistanceToNow(actividad.fecha, { addSuffix: true, locale: es })}
                                        </p>
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
