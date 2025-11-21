
import React, { useContext } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { ThemeContext } from '../../context/ThemeContext';

ChartJS.register(ArcElement, Tooltip, Legend);

const ReporteEstadoEmpleados = ({ data: chartData }) => {
    const { theme } = useContext(ThemeContext);
    if (!chartData) {
        return <p>No hay datos disponibles.</p>;
    }
    const data = {
        labels: chartData.labels,
        datasets: [
            {
                label: 'Cantidad de Empleados',
                data: chartData.values,
                backgroundColor: [
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(255, 206, 86, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: theme === 'dark' ? '#E5E7EB' : '#1F2937',
                }
            },
            tooltip: {
                titleColor: theme === 'dark' ? '#E5E7EB' : '#1F2937',
                bodyColor: theme === 'dark' ? '#D1D5DB' : '#4B5563',
            },
        },
    };

    return <Doughnut data={data} options={options} />;
};

export default ReporteEstadoEmpleados;
