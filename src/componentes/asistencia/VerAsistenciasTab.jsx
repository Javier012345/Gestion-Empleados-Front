import React from 'react';

const VerAsistenciasTab = () => {
    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Ver Asistencias por Empleado</h2>

            {/* DNI Search Form */}
            <div className="bg-gray-800 p-4 rounded-xl shadow-sm mb-6 border border-gray-700">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <label htmlFor="asistencia-dni-input" className="block mb-2 text-sm font-medium text-white">DNI Empleado</label>
                        <input id="asistencia-dni-input" type="text" placeholder="Buscar por DNI..." className="w-full px-4 py-2 rounded-lg border bg-gray-700 border-gray-600" />
                    </div>
                    <div className="flex items-end">
                        <button id="asistencia-search-btn" className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">Buscar</button>
                    </div>
                </div>
            </div>

            {/* Results Container (initially hidden) */}
            <div id="asistencia-results-container" className="hidden">
                <h3 className="text-xl font-bold">Resultados para <span id="asistencia-employee-name"></span></h3>

                {/* Period Filter Form (appears with results) */}
                <form id="asistencia-period-filter-form" className="my-4 p-4 bg-gray-800 rounded-xl shadow-sm border border-gray-700">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 items-end">
                        <div className="md:col-span-2">
                            <label className="block mb-2 text-sm font-medium text-white">Periodo</label>
                            <div className="flex items-center gap-2">
                                <select name="month" className="w-full px-4 py-2 rounded-lg border bg-gray-700 border-gray-600 focus:ring-red-500 focus:border-red-500">
                                    {/* Populate with months */}
                                    <option value="1">Enero</option>
                                    <option value="2">Febrero</option>
                                    {/* ... other months */}
                                </select>
                                <select name="year" className="w-full px-4 py-2 rounded-lg border bg-gray-700 border-gray-600 focus:ring-red-500 focus:border-red-500">
                                    {/* Populate with years */}
                                    <option value="2024">2024</option>
                                    <option value="2025">2025</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="por_pagina_tab" className="block mb-2 text-sm font-medium text-white">Registros</label>
                            <select name="por_pagina" id="por_pagina_tab" className="w-full px-4 py-2 rounded-lg border bg-gray-700 border-gray-600 focus:ring-red-500 focus:border-red-500">
                                <option value="10">10</option>
                                <option value="20">20</option>
                                <option value="30">30</option>
                                <option value="50">50</option>
                            </select>
                        </div>
                        <div className="flex gap-2 md:col-span-2">
                            <button type="submit" className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">Filtrar</button>
                            <button type="button" id="asistencia-clear-btn" className="w-full text-center px-4 py-2 rounded-lg border border-gray-600 hover:bg-gray-700">Limpiar</button>
                        </div>
                    </div>
                </form>

                <div id="asistencia-list" className="bg-gray-800 rounded-lg shadow-sm overflow-x-auto"></div>
                {/* Pagination container */}
                <div id="asistencia-pagination-container" className="mt-4"></div>
            </div>

            <div id="asistencia-no-search-message" className="text-center py-10 bg-gray-800 rounded-xl shadow-sm">
                <h3 className="mt-2 text-sm font-semibold text-white">Buscar asistencias de empleado</h3>
                <p className="mt-1 text-sm text-gray-500">Ingresa un DNI para ver las asistencias de un empleado.</p>
            </div>
        </div>
    );
};

export default VerAsistenciasTab;