
import React from 'react';

const MisAsistencias = () => {
    // Dummy data, replace with API call
    const asistencias = [
        { fecha_hora: '2025-10-31T09:02:00Z', minutos_retraso: 2 },
        { fecha_hora: '2025-10-30T09:10:00Z', minutos_retraso: 10 },
        { fecha_hora: '2025-10-29T08:59:00Z', minutos_retraso: -1 },
    ];

    const por_pagina = '10'; // Dummy value

    return (
        <div className="bg-gray-800 text-white p-4 rounded-lg">
            <h1 className="text-2xl mb-4">Mis Asistencias</h1>
            <div className="bg-gray-700 rounded-xl shadow-sm p-6">
                {/* Filter Form */}
                <form method="get" className="bg-gray-700 p-4 rounded-xl shadow-sm mb-6 -m-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 items-end">
                        <div className="md:col-span-2">
                            <label className="block mb-2 text-sm font-medium text-white">Periodo</label>
                            <div className="flex items-center gap-2">
                                <select name="month" className="w-full px-4 py-2 rounded-lg border bg-gray-800 border-gray-600 focus:ring-red-500 focus:border-red-500">
                                    <option value="10">Octubre</option>
                                    {/* Other months */}
                                </select>
                                <select name="year" className="w-full px-4 py-2 rounded-lg border bg-gray-800 border-gray-600 focus:ring-red-500 focus:border-red-500">
                                    <option value="2025">2025</option>
                                    {/* Other years */}
                                </select>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="por_pagina" className="block mb-2 text-sm font-medium text-white">Registros</label>
                            <select name="por_pagina" id="por_pagina" defaultValue={por_pagina} className="w-full px-4 py-2 rounded-lg border bg-gray-800 border-gray-600 focus:ring-red-500 focus:border-red-500">
                                <option value="10">10</option>
                                <option value="20">20</option>
                                <option value="30">30</option>
                                <option value="50">50</option>
                            </select>
                        </div>
                        <div className="flex gap-2 md:col-span-2">
                            <button type="submit" className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">Filtrar</button>
                            <a href="/mis-asistencias" className="w-full text-center px-4 py-2 rounded-lg border border-gray-600 hover:bg-gray-600">Limpiar</a>
                        </div>
                    </div>
                </form>

                {asistencias.length > 0 ? (
                    <div className="overflow-x-auto mt-6">
                        <table className="w-full">
                            <thead className="bg-gray-600 text-left text-sm font-semibold text-gray-300">
                                <tr>
                                    <th className="p-4">Fecha</th>
                                    <th className="p-4">Día</th>
                                    <th className="p-4">Hora de Ingreso</th>
                                    <th className="p-4">Minutos de Retraso</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-600">
                                {asistencias.map((asistencia, index) => (
                                    <tr key={index} className="bg-gray-700 hover:bg-gray-600">
                                        <td className="p-4 text-gray-300">{new Date(asistencia.fecha_hora).toLocaleDateString()}</td>
                                        <td className="p-4 text-gray-300">{new Date(asistencia.fecha_hora).toLocaleDateString('es-ES', { weekday: 'long' })}</td>
                                        <td className="p-4 font-semibold text-gray-100">{new Date(asistencia.fecha_hora).toLocaleTimeString()}</td>
                                        <td className="p-4 font-semibold">
                                            {asistencia.minutos_retraso > 5 ? (
                                                <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-red-300 bg-red-900 rounded-full">
                                                    {asistencia.minutos_retraso} min - Tarde
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-green-300 bg-green-900 rounded-full">
                                                    {asistencia.minutos_retraso} min - Correcto
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {/* Pagination would go here */}
                    </div>
                ) : (
                    <div className="text-center py-10">
                        <h3 className="mt-2 text-sm font-semibold text-white">Sin Resultados</h3>
                        <p className="mt-1 text-sm text-gray-500">No se encontraron asistencias para los filtros seleccionados.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MisAsistencias;
