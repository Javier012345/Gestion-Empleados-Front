import React from 'react';
import { useParams } from 'react-router-dom';

const IncidentePDF = () => {
    const { id } = useParams();

    return (
        <div className="p-6 text-center">
            <h1 className="text-2xl font-bold mb-4">Generando PDF para Incidente #{id}</h1>
            <p className="text-gray-600 dark:text-gray-400">Esta página simularía la generación o visualización de un PDF.</p>
            <p className="text-gray-600 dark:text-gray-400">En una aplicación real, aquí se integraría una librería de PDF o se haría una llamada a un API para obtener el PDF.</p>
        </div>
    );
};

export default IncidentePDF;