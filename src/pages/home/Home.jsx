import React, { useState, useEffect, useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import { Link } from 'react-router-dom';
import { getEmpleadosBasico, getSancionesEmpleados, getIncidentesAgrupados, getResumenDiario } from '../../services/api';
import { Users, UserCheck, ShieldAlert, UserPlus, Wrench, FileWarning, Bell, Loader, ArrowRight, Activity } from 'lucide-react';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
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

// --- Componentes de UI Senior ---

const StatCard = ({ title, value, icon, link, colorClass }) => (
    <Link to={link} className={`bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border-l-4 ${colorClass} hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group`}>
        <div className="flex items-center justify-between">
            <div>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">{title}</h3>
                <p className="text-3xl font-bold text-gray-800 dark:text-gray-100 mt-1">{value}</p>
            </div>
            <div className={`p-3 rounded-full bg-opacity-10 ${colorClass.replace('border-', 'bg-')}`}>
                {icon}
            </div>
        </div>
    </Link>
);

const InfoCard = ({ title, icon, children, footerLink, footerText }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="flex items-center gap-3 mb-4">
            {icon}
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">{title}</h2>
        </div>
        <div className="flex-grow">{children}</div>
    </div>
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
                        id: e.id,
                        tipo: 'NUEVA_CONTRATACION',
                        mensaje: `¡Bienvenido, ${e.nombre} ${e.apellido}!`,
                        fecha: new Date(e.fecha_ingreso)
                    }));

                const ultimasSanciones = sanciones
                    .sort((a, b) => new Date(b.fecha_sancion) - new Date(a.fecha_sancion))
                    .slice(0, 3)
                    .map(s => ({
                        id: s.id,
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
        return (
            <div className="flex justify-center items-center h-[calc(100vh-8rem)]">
                <Loader className="animate-spin text-red-500" size={48} />
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 space-y-8">

            {/* Tarjetas de Estadísticas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Empleados" value={dashboardData.total_empleados} icon={<Users className="w-6 h-6 text-blue-500" />} link="/empleados" colorClass="border-blue-500" />
                <StatCard title="Asistencia Hoy" value={`${dashboardData.asistencia_hoy} / ${dashboardData.total_empleados_activos}`} icon={<UserCheck className="w-6 h-6 text-green-500" />} link="/asistencia" colorClass="border-green-500" />
                <StatCard title="Sanciones (Mes)" value={dashboardData.sanciones_mes} icon={<ShieldAlert className="w-6 h-6 text-yellow-500" />} link="/sanciones" colorClass="border-yellow-500" />
                <StatCard title="Contrataciones (Mes)" value={dashboardData.contrataciones_mes} icon={<UserPlus className="w-6 h-6 text-red-500" />} link="/empleados" colorClass="border-red-500" />
            </div>

            {/* Grid para Gráficos y Listas */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <InfoCard title="Contrataciones Recientes" icon={<Users className="text-red-500" />}>
                        <div className="relative h-auto" style={{ aspectRatio: '2 / 1' }}>
                            <Line options={hiresChartOptions} data={hiresChartData} />
                        </div>
                    </InfoCard>

                    <InfoCard title="Últimos Incidentes" icon={<FileWarning className="text-red-500" />}>
                        {dashboardData.ultimos_incidentes.length > 0 ? (
                            <ul className="space-y-3">
                                {dashboardData.ultimos_incidentes.map(incidente => (
                                    <li key={incidente.id}>
                                        <Link to={`/incidentes/${incidente.id}`} className="flex items-center gap-4 p-3 rounded-xl transition duration-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 group">
                                            <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-red-100 dark:bg-red-900/50 text-red-500">
                                                {getIncidentIcon(incidente.tipo)}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-semibold text-sm text-gray-800 dark:text-gray-100">{incidente.tipo}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">Involucra a: {incidente.empleado}</p>
                                            </div>
                                            <ArrowRight size={16} className="text-gray-400 group-hover:text-red-500 transition-colors" />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="text-center py-10">
                                <FileWarning size={32} className="mx-auto text-gray-400" />
                                <p className="mt-2 text-sm text-gray-500">No hay incidentes recientes.</p>
                            </div>
                        )}
                    </InfoCard>
                </div>

                <div className="lg:col-span-1 space-y-8">
                    <InfoCard title="Distribución de Empleados" icon={<Users className="text-red-500" />}>
                        <div className="h-64 flex items-center justify-center">
                            <Doughnut options={statusChartOptions} data={statusChartData} />
                        </div>
                    </InfoCard>

                    <InfoCard title="Actividad Reciente" icon={<Activity className="text-red-500" />}>
                        {dashboardData.actividad_reciente.length > 0 ? (
                            <ul className="space-y-3">
                                {dashboardData.actividad_reciente.map(actividad => (
                                    <li key={`${actividad.tipo}-${actividad.id}`}>
                                        <Link to={actividad.tipo === 'NUEVA_CONTRATACION' ? `/empleados/${actividad.id}` : `/sanciones/${actividad.id}`} className="flex items-start gap-4 p-3 rounded-xl transition duration-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 group">
                                            <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400">
                                                {getActivityIcon(actividad.tipo)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-gray-800 dark:text-gray-100">{actividad.mensaje}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                                    {formatDistanceToNow(actividad.fecha, { addSuffix: true, locale: es })}
                                                </p>
                                            </div>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="text-center py-10">
                                <Activity size={32} className="mx-auto text-gray-400" />
                                <p className="mt-2 text-sm text-gray-500">No hay actividad reciente.</p>
                            </div>
                        )}
                    </InfoCard>
                </div>
            </div>
        </div>
    );
};

export default Home;
