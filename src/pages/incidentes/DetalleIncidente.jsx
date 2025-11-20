import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { ArrowLeft, History, Pencil, Printer, FilePlus, MessageSquare, Paperclip, Gavel, X, ShieldPlus, Loader, AlertTriangle, CheckCircle } from 'lucide-react';
import { getIncidenteAgrupadoPorId, createResolucion, getIncidenteEmpleadoPorId } from '../../services/api';
import AplicarSancionIncidente from './AplicarSancionIncidente';

const DetalleIncidente = () => {
    const { id } = useParams();
    const [incidente, setIncidente] = useState(null);
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    // State for resolution modal
    const [showModal, setShowModal] = useState(false);
    const [resolucionDescripcion, setResolucionDescripcion] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [resolutionError, setResolutionError] = useState('');
    const [resolutionSuccess, setResolutionSuccess] = useState('');

    // State for sanction form
    const [showSancionForm, setShowSancionForm] = useState(false);
    const [localResolucion, setLocalResolucion] = useState(null);

    const isMyIncidentRoute = location.pathname.startsWith('/mis-incidentes');

    const fetchIncidente = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = isMyIncidentRoute
                ? await getIncidenteEmpleadoPorId(id)
                : await getIncidenteAgrupadoPorId(id);
            
            let incidenteData = response.data;
            if (isMyIncidentRoute && incidenteData.id_incidente) {
                // Normalizamos la propiedad del tipo de incidente
                incidenteData.incidente = incidenteData.id_incidente;

                // Normalizamos la estructura de los descargos
                if (Array.isArray(incidenteData.descargos)) {
                    incidenteData.descargos_del_grupo = incidenteData.descargos.map(descargo => ({
                        empleado: descargo.autor,
                        descargo: {
                            fecha_descargo: descargo.fecha_descargo,
                            contenido_descargo: descargo.contenido_descargo,
                            ruta_archivo_descargo: descargo.ruta_archivo_descargo
                        }
                    }));
                }
            }

            console.log('Datos del incidente recibidos:', incidenteData);
            setIncidente(incidenteData);
            setError('');
        } catch (err) {
            setError('No se pudo cargar el detalle del incidente. Inténtalo de nuevo más tarde.');
            console.error("Error fetching incident details:", err);
        } finally {
            setIsLoading(false);
        }
    }, [id, isMyIncidentRoute]);

    useEffect(() => {
        fetchIncidente();
    }, [fetchIncidente]);

    const handleOpenModal = () => setShowModal(true);
    const handleCloseModal = () => {
        setShowModal(false);
        setResolucionDescripcion('');
        setResolutionError('');
        setResolutionSuccess('');
    };

    const postResolution = async (descripcion) => {
        const body = {
            grupo_incidente: incidente?.grupo_incidente,
            descripcion: descripcion,
        };
        await createResolucion(body);
    };

    if (isLoading) {
        return <div className="flex justify-center items-center p-8"><Loader className="animate-spin mr-2" /> Cargando detalle del incidente...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center p-8 text-red-500"><AlertTriangle className="mr-2" /> {error}</div>;
    }

    const handleResolutionSubmit = (e) => {
        e.preventDefault();
        setResolutionError('');
    
        if (!resolucionDescripcion.trim()) {
            setResolutionError('La descripción de la resolución es obligatoria.');
            return;
        }
    
        setLocalResolucion({
            descripcion: resolucionDescripcion,
        });
        
        setShowSancionForm(true);
        handleCloseModal();
    };

    const handleCerrarIncidente = async (e) => {
        e.preventDefault(); // Prevenir cualquier comportamiento por defecto
        setResolutionError('');
        setResolutionSuccess('');

        if (!resolucionDescripcion.trim()) {
            setResolutionError('La descripción es obligatoria para cerrar el incidente.');
            return;
        }

        setIsSubmitting(true);
        try {
            // Usar la descripción del textarea
            await postResolution(resolucionDescripcion);
            setResolutionSuccess('El incidente ha sido cerrado con éxito.');
            await fetchIncidente();
            setTimeout(handleCloseModal, 2000);
        } catch (err) {
            setResolutionError('Error al cerrar el incidente. Inténtalo de nuevo.');
            console.error("Error closing incident:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (showSancionForm) {
        return <AplicarSancionIncidente incidente={incidente} resolucion={localResolucion} onVolver={() => setShowSancionForm(false)} />;
    }

    return (
        <div className="max-w-2xl mx-auto">
            <Link to={location.pathname.startsWith('/mis-incidentes') ? "/mis-incidentes" : "/incidentes"} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500 mb-6">
                <ArrowLeft size={16} /> Volver
            </Link>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-start">
                    <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Detalle del Incidente</h2>
                    <div className="flex items-center gap-2">
                        {incidente?.grupo_anterior && (
                            <Link to={`/incidentes/${incidente?.grupo_anterior}`} className="bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-emerald-700 text-sm">
                                <History size={16} /> Ver Incidente Original
                            </Link>
                        )}
                        {!incidente?.resolucion && (
                            <Link to={`/incidentes/corregir/${incidente?.grupo_incidente}`} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700">
                                <Pencil size={16} />Corregir
                            </Link>
                        )}
                        <a href={`/incidentes/pdf/${incidente?.grupo_incidente}`} target="_blank" rel="noopener noreferrer" className="bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-700 text-sm">
                            <Printer size={16} /> Imprimir
                        </a>
                    </div>
                </div>

                <div className="space-y-4">
                    <div><h4 className="text-sm font-semibold text-gray-500">Nombre del Incidente</h4><p className="text-gray-900 dark:text-white">{incidente?.incidente.tipo_incid}</p></div>
                    <div><h4 className="text-sm font-semibold text-gray-500">Fecha</h4><p className="text-gray-900 dark:text-white">{new Date(incidente?.fecha_ocurrencia).toLocaleDateString('es-AR', { timeZone: 'UTC' })}</p></div>
                    <div><h4 className="text-sm font-semibold text-gray-500">Descripción</h4><p className="text-gray-600 dark:text-gray-300">{incidente?.descripcion}</p></div>
                    
                    {!isMyIncidentRoute && (
                        <div>
                            <h4 className="text-sm font-semibold text-gray-500 mb-2">Empleados Involucrados</h4>
                            <div className="space-y-2">
                                {Array.isArray(incidente?.empleados_involucrados) && incidente.empleados_involucrados.map((involucrado, index) => (
                                    <div key={index} className="flex items-center justify-between p-2 rounded-md bg-gray-50 dark:bg-gray-700/50">
                                        <div className="flex items-center gap-3">
                                            <div>
                                                <p className="font-semibold text-sm text-gray-900 dark:text-white">{involucrado.nombre} {involucrado.apellido}</p>
                                                <p className="text-xs text-gray-500">DNI: {involucrado.dni}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${incidente.estado === 'ABIERTO' ? 'text-yellow-800 bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-300' : 'text-green-800 bg-green-200 dark:bg-green-900 dark:text-green-300'}`}>
                                                {incidente.estado === 'ABIERTO' ? 'Abierto' : 'Cerrado'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <h4 className="text-sm font-semibold text-gray-500 mt-6 mb-3">Historial del Caso</h4>
                <ol className="relative border-l border-gray-200 dark:border-gray-700 ml-2">
                    <li className="mb-6 ml-6">
                        <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white dark:ring-gray-800 dark:bg-blue-900">
                            <FilePlus size={12} className="text-blue-800 dark:text-blue-300" />
                        </span>
                        <h3 className="flex items-center mb-1 text-md font-semibold text-gray-900 dark:text-white">Incidente Reportado</h3>
                        <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">Reportado el {new Date(incidente?.fecha_ocurrencia).toLocaleDateString('es-AR', { timeZone: 'UTC' })}</time>
                    </li>

                    {incidente?.descargos_del_grupo.length > 0 ? (
                        <li className="mb-6 ml-6">
                            <span className="absolute flex items-center justify-center w-6 h-6 bg-cyan-100 rounded-full -left-3 ring-8 ring-white dark:ring-gray-800 dark:bg-cyan-900">
                                <MessageSquare size={12} className="text-cyan-800 dark:text-cyan-300" />
                            </span>
                            <h3 className="text-md font-semibold text-gray-900 dark:text-white">Descargos Recibidos</h3>
                            {incidente.descargos_del_grupo.map((item, index) => (
                                <div key={index} className="mt-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{item.empleado.nombre} {item.empleado.apellido}</p>
                                        <time className="text-xs text-gray-400 dark:text-gray-500 ml-auto">{new Date(item.descargo.fecha_descargo).toLocaleDateString('es-AR', { timeZone: 'UTC' })}</time>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 italic">"{item.descargo.contenido_descargo}"</p>
                                    {item.descargo.ruta_archivo_descargo && (
                                        <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                                            <a href={item.descargo.ruta_archivo_descargo} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-blue-600 hover:underline">
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

                    {incidente?.resolucion ? (
                        <li className="ml-6">
                            <span className="absolute flex items-center justify-center w-6 h-6 bg-green-100 rounded-full -left-3 ring-8 ring-white dark:ring-gray-800 dark:bg-green-900">
                                <Gavel size={12} className="text-green-800 dark:text-green-300" />
                            </span>
                            <h3 className="text-md font-semibold text-gray-900 dark:text-white">Incidente Resuelto</h3>
                            <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">Resuelto el {new Date(incidente.resolucion.fecha_resolucion).toLocaleDateString('es-AR', { timeZone: 'UTC' })}</time>
                            <p className="text-sm font-normal text-gray-500 dark:text-gray-400">{incidente.resolucion.descripcion_resolucion}</p>
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

                {!incidente?.resolucion && (
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

                            {resolutionSuccess && <div className="mt-4 flex items-center gap-3 rounded-lg bg-green-50 dark:bg-green-900/20 p-4 text-sm text-green-700 dark:text-green-300"><CheckCircle className="h-5 w-5" /><p>{resolutionSuccess}</p></div>}
                            {resolutionError && <div className="mt-4 flex items-center gap-3 rounded-lg bg-red-50 dark:bg-red-900/20 p-4 text-sm text-red-700 dark:text-red-300"><AlertTriangle className="h-5 w-5" /><p>{resolutionError}</p></div>}

                            <form onSubmit={handleResolutionSubmit} className="mt-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Descripción de la Resolución</label>
                                    <textarea 
                                        rows="4" 
                                        value={resolucionDescripcion}
                                        onChange={(e) => setResolucionDescripcion(e.target.value)}
                                        required
                                        className="mt-1 block w-full rounded-md border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white focus:border-red-500 focus:ring-red-500"
                                    ></textarea>
                                </div>
                                <div className="pt-4 flex flex-col sm:flex-row justify-end gap-3">
                                    <button type="button" onClick={handleCerrarIncidente} disabled={isSubmitting} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 disabled:opacity-50">Cerrar Incidente</button>
                                    <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 disabled:bg-red-400"><ShieldPlus size={16} />{isSubmitting ? 'Guardando...' : 'Guardar y Sancionar'}</button>
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