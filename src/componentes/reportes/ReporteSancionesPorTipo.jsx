
import React from 'react';
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

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const ReporteSancionesPorTipo = () => {
    const data = {
        labels: ['Leve', 'Moderada', 'Grave'],
        datasets: [
            {
                label: 'Cantidad de Sanciones',
                data: [8, 4, 1],
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
        },
        scales: {
            x: {
                beginAtZero: true,
                ticks: { color: '#E5E7EB', stepSize: 1 },
                grid: { color: 'rgba(255, 255, 255, 0.1)' }
            },
            y: {
                ticks: { color: '#E5E7EB' },
                grid: { display: false }
            }
        }
    };

    return <Bar data={data} options={options} />;
};

export default ReporteSancionesPorTipo;
