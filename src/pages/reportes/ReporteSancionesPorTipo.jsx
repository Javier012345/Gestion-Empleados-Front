
import React, { useContext } from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { ThemeContext } from '../../context/ThemeContext';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const ReporteSancionesPorTipo = ({ data: chartData }) => {
    const { theme } = useContext(ThemeContext);
    if (!chartData) {
        return <p>No hay datos disponibles.</p>;
    }
    const data = {
        labels: chartData.labels,
        datasets: [
            {
                label: 'Cantidad de Sanciones',
                data: chartData.values,
                backgroundColor: 'rgba(255, 159, 64, 0.7)',
                borderColor: 'rgba(255, 159, 64, 1)',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                titleColor: theme === 'dark' ? '#E5E7EB' : '#1F2937',
                bodyColor: theme === 'dark' ? '#D1D5DB' : '#4B5563',
            },
        },
        scales: {
            x: {
                beginAtZero: true,
                ticks: { color: theme === 'dark' ? '#E5E7EB' : '#374151', stepSize: 1 },
                grid: { color: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }
            },
            y: {
                ticks: { color: theme === 'dark' ? '#E5E7EB' : '#374151' },
                grid: { display: false }
            }
        }
    };

    return <Bar data={data} options={options} />;
};

export default ReporteSancionesPorTipo;
