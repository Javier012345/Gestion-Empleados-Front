import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, History, Pencil, Printer, User, FilePlus, MessageSquare, Paperclip, Gavel, X, ShieldPlus } from 'lucide-react';

const DetalleIncidente = () => {
    const { id } = useParams();
    const [showModal, setShowModal] = useState(false);

    // Dummy data
    const incidente = {
        id: id,
        tipo_incid: 'Ausencia Injustificada',
        fecha_incidente: '25/10/2025',
        descripcion_incid: 'El empleado no se presentó a trabajar sin previo aviso.',
        involucrados: [
            { id_empl: { nombre: 'Juan', apellido: 'Perez', dni: '12345678' }, estado: 'ABIERTO', ya_sancionado: false },
            { id_empl: { nombre: 'Maria', apellido: 'Gomez', dni: '87654321' }, estado: 'CERRADO', ya_sancionado: true },
        ],
        descargos: [
            {
                empleado: { nombre: 'Juan', apellido: 'Perez' },
                descargo: { fecha_descargo: '26/10/2025', contenido_descargo: 'Tuve una emergencia familiar y no pude avisar.', ruta_archivo_descargo: null }
            }
        ],
        resolucion: null, // { descripcion: 'Se aplica amonestación verbal.', fecha_resolucion: '27/10/2025' },
        corrected_incident_id: null,
    };

    const handleOpenModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    return (
        <div className="max-w-2xl mx-auto">
            <Link to="/incidentes" className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500 mb-6">
                <ArrowLeft size={16} /> Volver
            </Link>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-start">
                    <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Detalle del Incidente</h2>
                    <div className="flex items-center gap-2">
                        {incidente.corrected_incident_id && (
                            <Link to={`/incidentes/${incidente.corrected_incident_id}`} className="bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-emerald-700 text-sm">
                                <History size={16} /> Ver Incidente Original
                            </Link>
                        )}
                        {!incidente.resolucion && (
                            <Link to={`/incidentes/corregir/${incidente.id}`} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700">
                                <Pencil size={16} />Corregir
                            </Link>
                        )}
                        <a href={`/incidentes/pdf/${incidente.id}`} target="_blank" className="bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-700 text-sm">
                            <Printer size={16} /> Imprimir
                        </a>
                    </div>
                </div>

                <div className="space-y-4">
                    <div><h4 className="text-sm font-semibold text-gray-500">Nombre del Incidente</h4><p className="text-gray-900 dark:text-white">{incidente.tipo_incid}</p></div>
                    <div><h4 className="text-sm font-semibold text-gray-500">Fecha</h4><p className="text-gray-900 dark:text-white">{incidente.fecha_incidente}</p></div>
                    <div><h4 className="text-sm font-semibold text-gray-500">Descripción</h4><p className="text-gray-600 dark:text-gray-300">{incidente.descripcion_incid}</p></div>
                    
                    <div>
                        <h4 className="text-sm font-semibold text-gray-500 mb-2">Empleados Involucrados</h4>
                        <div className="space-y-2">
                            {incidente.involucrados.map((involucrado, index) => (
                                <div key={index} className="flex items-center justify-between p-2 rounded-md bg-gray-50 dark:bg-gray-700/50">
                                    <div className="flex items-center gap-3">
                                        <div>
                                            <p className="font-semibold text-sm text-gray-900 dark:text-white">{involucrado.id_empl.nombre} {involucrado.id_empl.apellido}</p>
                                            <p className="text-xs text-gray-500">DNI: {involucrado.id_empl.dni}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        {involucrado.ya_sancionado ? (
                                            <span className="text-xs font-semibold text-green-600 bg-green-100 dark:text-green-200 dark:bg-green-900 px-2 py-1 rounded-full">Sancionado</span>
                                        ) : involucrado.estado === 'CERRADO' ? (
                                            <span className="text-xs font-semibold text-red-600 bg-red-100 dark:text-red-200 dark:bg-red-900 px-2 py-1 rounded-full">Cerrado</span>
                                        ) : (
                                            <span className="text-xs font-semibold text-yellow-600 bg-yellow-100 dark:text-yellow-200 dark:bg-yellow-900 px-2 py-1 rounded-full">Pendiente</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <h4 className="text-sm font-semibold text-gray-500 mt-6 mb-3">Historial del Caso</h4>
                <ol className="relative border-l border-gray-200 dark:border-gray-700 ml-2">
                    <li className="mb-6 ml-6">
                        <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white dark:ring-gray-800 dark:bg-blue-900">
                            <FilePlus size={12} className="text-blue-800 dark:text-blue-300" />
                        </span>
                        <h3 className="flex items-center mb-1 text-md font-semibold text-gray-900 dark:text-white">Incidente Reportado</h3>
                        <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">Reportado el {incidente.fecha_incidente}</time>
                    </li>

                    {incidente.descargos.length > 0 ? (
                        <li className="mb-6 ml-6">
                            <span className="absolute flex items-center justify-center w-6 h-6 bg-cyan-100 rounded-full -left-3 ring-8 ring-white dark:ring-gray-800 dark:bg-cyan-900">
                                <MessageSquare size={12} className="text-cyan-800 dark:text-cyan-300" />
                            </span>
                            <h3 className="text-md font-semibold text-gray-900 dark:text-white">Descargos Recibidos</h3>
                            {incidente.descargos.map((item, index) => (
                                <div key={index} className="mt-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{item.empleado.nombre} {item.empleado.apellido}</p>
                                        <time className="text-xs text-gray-400 dark:text-gray-500 ml-auto">{item.descargo.fecha_descargo}</time>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 italic">"{item.descargo.contenido_descargo}"</p>
                                    {item.descargo.ruta_archivo_descargo && (
                                        <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                                            <a href={item.descargo.ruta_archivo_descargo} className="flex items-center gap-2 text-xs text-blue-600 hover:underline">
                                                <Paperclip size={12} /><span>Archivo Adjunto</span>
                                            </a>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </li>
                    ) : (
                        <li className="mb-6 ml-6">
                            <span className="absolute flex items-center justify-center w-6 h-6 bg-gray-100 rounded-full -left-3 ring-8 ring-white dark:ring-gray-800 dark:bg-gray-700">
                                <MessageSquare size={12} className="text-gray-500" />
                            </span>
                            <h3 className="text-md font-semibold text-gray-500 dark:text-gray-400">Sin Descargos</h3>
                            <p className="text-sm font-normal text-gray-500 dark:text-gray-400">No se han registrado descargos de los involucrados.</p>
                        </li>
                    )}

                    {incidente.resolucion ? (
                        <li className="ml-6">
                            <span className="absolute flex items-center justify-center w-6 h-6 bg-green-100 rounded-full -left-3 ring-8 ring-white dark:ring-gray-800 dark:bg-green-900">
                                <Gavel size={12} className="text-green-800 dark:text-green-300" />
                            </span>
                            <h3 className="text-md font-semibold text-gray-900 dark:text-white">Incidente Resuelto</h3>
                            <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">Resuelto el {incidente.resolucion.fecha_resolucion}</time>
                            <p className="text-sm font-normal text-gray-500 dark:text-gray-400">{incidente.resolucion.descripcion}</p>
                        </li>
                    ) : (
                        <li className="ml-6">
                            <span className="absolute flex items-center justify-center w-6 h-6 bg-gray-100 rounded-full -left-3 ring-8 ring-white dark:ring-gray-800 dark:bg-gray-700">
                                <Gavel size={12} className="text-gray-800 dark:text-gray-300" />
                            </span>
                            <h3 className="text-md font-semibold text-gray-500 dark:text-gray-400">Resolución Pendiente</h3>
                        </li>
                    )}
                </ol>

                {!incidente.resolucion && (
                    <div id="incident-actions-container" className="mt-8 pt-6 border-t dark:border-gray-700">
                        <div className="flex justify-end">
                            <button onClick={handleOpenModal} className="bg-red-600 text-white px-6 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-red-700">
                                <Gavel size={16} /><span>Registrar Resolución</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* Resolution Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg p-6 m-4" onClick={e => e.stopPropagation()}>
                            <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Registrar Resolución de Incidente</h2>
                                <button onClick={handleCloseModal} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white"><X size={24} /></button>
                            </div>
                            <form className="mt-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Descripción de la Resolución</label>
                                    <textarea rows="4" className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white"></textarea>
                                </div>
                                <div className="pt-4 flex flex-col sm:flex-row justify-end gap-3">
                                    <button type="button" onClick={handleCloseModal} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500">Solo Cerrar Incidente</button>
                                    <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"><ShieldPlus size={16} />Guardar y Aplicar Sanción</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DetalleIncidente;