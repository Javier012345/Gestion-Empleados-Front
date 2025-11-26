import React, { useState, useEffect } from 'react';
import { ArrowLeft, ShieldAlert, CheckCircle } from 'lucide-react';
import { aplicarSancionEmpleado, getTiposSancion, createResolucion } from '../../services/api';

const AplicarSancionIncidente = ({ incidente, resolucion, onVolver }) => {
    const [selectedEmpleado, setSelectedEmpleado] = useState(null);
    const [tiposSancion, setTiposSancion] = useState([]);
    const [sancionId, setSancionId] = useState('');
    const [observaciones, setObservaciones] = useState('');
    const [fechaInicio, setFechaInicio] = useState(new Date().toISOString().split('T')[0]);
    const [fechaFin, setFechaFin] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [sancionados, setSancionados] = useState([]);
    const [isFinishing, setIsFinishing] = useState(false);
    const [isLoadingSanciones, setIsLoadingSanciones] = useState(true);

    useEffect(() => {
        const fetchTiposSancion = async () => {
            setIsLoadingSanciones(true);
            try {
                const response = await getTiposSancion();
                console.log('Respuesta de getTiposSancion:', response.data); // <-- Punto de diagnóstico
                setTiposSancion(response.data);
            } catch (error) {
                console.error("Error fetching sanction types:", error);
                setError('No se pudieron cargar los tipos de sanción.');
            } finally {
                setIsLoadingSanciones(false);
            }
        };
        fetchTiposSancion();
    }, []);

    const handleEmpleadoSelect = (empleado) => {
        if (sancionados.includes(empleado.id)) return; // No re-seleccionar si ya está sancionado
        setSelectedEmpleado(empleado);
        setObservaciones('');
        setError('');
        setFechaInicio(new Date().toISOString().split('T')[0]);
        setFechaFin('');
        setSuccess('');
    };

    const handleSubmitSancion = async (e) => {
        e.preventDefault();
        if (!selectedEmpleado) {
            setError('Por favor, selecciona un empleado.');
            return;
        }
        if (!sancionId) {
            setError('Por favor, selecciona un tipo de sanción.');
            return;
        }

        setIsSubmitting(true);
        setError('');
        setSuccess('');

        const motivo = `Derivado del incidente: ${incidente.incidente.tipo_incid}. Resolución: ${resolucion.descripcion}. ${observaciones}`;

        const sancionData = {
            empleado_id: selectedEmpleado.id,
            sancion_id: sancionId,
            motivo: motivo,
            fecha_inicio: fechaInicio,
            grupo_incidente: incidente.grupo_incidente,
        };

        if (fechaFin) {
            sancionData.fecha_fin = fechaFin;
        }
        try {
            await aplicarSancionEmpleado(sancionData);
            setSuccess(`Sanción aplicada con éxito a ${selectedEmpleado.nombre} ${selectedEmpleado.apellido}.`);
            setSancionados([...sancionados, selectedEmpleado.id]);
            setSelectedEmpleado(null);
        } catch (err) {
            setError('Error al aplicar la sanción. Inténtalo de nuevo.');
            console.error("Error creating sanction:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFinish = async () => {
        setIsFinishing(true);
        setError('');
        setSuccess('');
        try {
            const resolucionData = {
                grupo_incidente: incidente.grupo_incidente,
                descripcion: resolucion.descripcion,
            };
            await createResolucion(resolucionData);
            setSuccess('¡Incidente cerrado y resolución guardada con éxito!');
            setTimeout(() => {
                onVolver(); // Vuelve a la vista de detalles que se refrescará
            }, 2000);
        } catch (err) {
            setError('Error al guardar la resolución final. Inténtalo de nuevo.');
            console.error("Error creating resolution:", err);
        } finally {
            setIsFinishing(false);
        }
    };

    const allSanctioned = sancionados.length === incidente.empleados_involucrados.length;

    return (
        <div className="max-w-4xl mx-auto">
            <button onClick={onVolver} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500 mb-6">
                <ArrowLeft size={16} /> Volver al Detalle del Incidente
            </button>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Aplicar Sanción por Incidente</h2>
                
                <div className="mb-6 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Incidente: {incidente.incidente.tipo_incid}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Resolución: "{resolucion.descripcion}"</p>
                </div>

                {error && <p className="mb-4 text-sm text-center text-red-500">{error}</p>}
                {success && <p className="mb-4 text-sm text-center text-green-500">{success}</p>}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Empleados Involucrados</h4>
                        <div className="space-y-2">
                            {incidente.empleados_involucrados.map((empleado) => {
                                const isSanctioned = sancionados.includes(empleado.id);
                                return (
                                    <div 
                                        key={empleado.id} 
                                        onClick={() => handleEmpleadoSelect(empleado)}
                                        className={`p-3 rounded-lg transition-all flex items-center justify-between ${
                                            isSanctioned 
                                            ? 'bg-green-100 dark:bg-green-900/40 cursor-not-allowed' 
                                            : selectedEmpleado?.id === empleado.id 
                                                ? 'bg-red-100 dark:bg-red-900/50 ring-2 ring-red-500 cursor-pointer' 
                                                : 'bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer'
                                        }`}
                                    >
                                        <div>
                                            <p className="font-semibold text-sm text-gray-900 dark:text-white">{empleado.nombre} {empleado.apellido}</p>
                                            <p className="text-xs text-gray-500">DNI: {empleado.dni}</p>
                                        </div>
                                        {isSanctioned && <CheckCircle size={20} className="text-green-500" />}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        {!allSanctioned && selectedEmpleado ? (
                            <form onSubmit={handleSubmitSancion} className="space-y-4">
                                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Sancionar a: <span className="text-red-600">{selectedEmpleado.nombre} {selectedEmpleado.apellido}</span>
                                </h4>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tipo de Sanción</label>
                                    <select 
                                        value={sancionId}
                                        onChange={(e) => setSancionId(e.target.value)}
                                        className="w-full mt-1 px-4 py-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                                    >
                                        {isLoadingSanciones ? (
                                            <option value="" disabled>Cargando tipos de sanción...</option>
                                        ) : (
                                            <>
                                                <option value="" disabled className="text-gray-500">Seleccione una sanción...</option>
                                                {tiposSancion && tiposSancion.length > 0 ? tiposSancion.map(ts => (
                                                    <option key={ts.id} value={ts.id}>{ts.nombre}</option>
                                                )) : <option disabled>No hay sanciones disponibles</option>}
                                            </>
                                        )}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Observaciones Adicionales</label>
                                    <textarea 
                                        rows="3" 
                                        value={observaciones}
                                        onChange={(e) => setObservaciones(e.target.value)}
                                        placeholder="Añadir detalles específicos para este empleado..."
                                        className="w-full mt-1 px-4 py-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                                    ></textarea>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Fecha de Inicio</label>
                                        <input 
                                            type="date"
                                            value={fechaInicio}
                                            onChange={(e) => setFechaInicio(e.target.value)}
                                            required
                                            className="w-full mt-1 px-4 py-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Fecha de Fin (Opcional)</label>
                                        <input 
                                            type="date"
                                            value={fechaFin}
                                            onChange={(e) => setFechaFin(e.target.value)}
                                            className="w-full mt-1 px-4 py-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white" />
                                    </div>
                                </div>
                                
                                <div className="pt-4 flex justify-end">
                                    <button 
                                        type="submit" 
                                        disabled={isSubmitting} 
                                        className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 disabled:bg-red-400"
                                    >
                                        <ShieldAlert size={16} />
                                        {isSubmitting ? 'Aplicando...' : 'Aplicar Sanción'}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg dark:border-gray-600">
                                {allSanctioned ? (
                                    <>
                                        <CheckCircle size={48} className="text-green-500 mb-4" />
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Todos los empleados han sido gestionados.</h3>
                                        <p className="text-gray-500 dark:text-gray-400 mt-2">Ahora puedes cerrar el incidente.</p>
                                    </>
                                ) : (
                                    <p className="text-gray-500 dark:text-gray-400">Selecciona un empleado de la lista para aplicarle una sanción.</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {allSanctioned && (
                    <div className="mt-8 pt-6 border-t dark:border-gray-700 flex justify-end">
                        <button 
                            onClick={handleFinish}
                            disabled={isFinishing}
                            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 disabled:bg-green-400"
                        >
                            <CheckCircle size={16} />
                            {isFinishing ? 'Finalizando...' : 'Finalizar y Cerrar Incidente'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AplicarSancionIncidente;
