import React, { useState, useEffect } from 'react';
import { ArrowLeft, AlertTriangle, CheckCircle, Loader, History } from 'lucide-react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getIncidenteAgrupadoPorId, getEmpleadosBasico, getTiposIncidente, corregirIncidente } from '../../services/api';

const CorregirIncidente = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        incidente_id: '',
        empleado_ids: [],
        fecha_ocurrencia: '',
        descripcion: '',
        observaciones: ''
    });
    const [originalIncidente, setOriginalIncidente] = useState(null);
    const [tiposIncidente, setTiposIncidente] = useState([]);
    const [allEmpleados, setAllEmpleados] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const [incidenteRes, empleadosRes, tiposRes] = await Promise.all([
                    getIncidenteAgrupadoPorId(id),
                    getEmpleadosBasico(),
                    getTiposIncidente()
                ]);

                const incidenteData = incidenteRes.data;
                setOriginalIncidente(incidenteData);
                setFormData({
                    incidente_id: incidenteData.incidente.id,
                    empleado_ids: incidenteData.empleados_involucrados.map(emp => emp.id),
                    fecha_ocurrencia: incidenteData.fecha_ocurrencia,
                    descripcion: incidenteData.descripcion,
                    observaciones: incidenteData.observaciones || ''
                });

                setAllEmpleados(empleadosRes.data);
                setTiposIncidente(tiposRes.data);

            } catch (err) {
                setError('Error al cargar los datos para la corrección.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;
        const empleadoId = parseInt(value, 10);

        setFormData(prev => {
            if (checked) {
                return { ...prev, empleado_ids: [...prev.empleado_ids, empleadoId] };
            } else {
                return { ...prev, empleado_ids: prev.empleado_ids.filter(id => id !== empleadoId) };
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!formData.incidente_id || !formData.fecha_ocurrencia || !formData.descripcion || formData.empleado_ids.length === 0) {
            setError('Por favor, completa todos los campos obligatorios: tipo, fecha, descripción y al menos un empleado.');
            return;
        }

        setIsSubmitting(true);
        // Log para depuración: muestra los datos que se enviarán a la API
        console.log('Datos a enviar para corrección:', formData);

        try {
            await corregirIncidente(id, formData);
            setSuccess('Incidente corregido con éxito.');
            setTimeout(() => navigate(`/incidentes/${id}`), 2000);
        } catch (err) {
            setError('Error al guardar la corrección. Inténtalo de nuevo.');
            console.error('Error correcting incident:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return <div className="flex justify-center items-center p-8"><Loader className="animate-spin mr-2" /> Cargando formulario de corrección...</div>;
    }

    return (
        <div className="max-w-2xl mx-auto">
            <Link to={`/incidentes/${id}`} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500 mb-6">
                <ArrowLeft size={16} /> Volver al Incidente
            </Link>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                <div className="flex justify-between items-start mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Corregir Incidente</h2>
                    {originalIncidente?.grupo_anterior && (
                        <Link 
                            to={`/incidentes/${originalIncidente.grupo_anterior}`} 
                            className="bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-emerald-700 text-sm">
                            <History size={16} /> Ver Incidente Original
                        </Link>
                    )}
                </div>

                {success && <div className="mb-4 flex items-center gap-3 rounded-lg bg-green-50 dark:bg-green-900/20 p-4 text-sm text-green-700 dark:text-green-300"><CheckCircle className="h-5 w-5" /><p>{success}</p></div>}
                {error && <div className="mb-4 flex items-center gap-3 rounded-lg bg-red-50 dark:bg-red-900/20 p-4 text-sm text-red-700 dark:text-red-300"><AlertTriangle className="h-5 w-5" /><p>{error}</p></div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tipo de Incidente</label>
                        <select name="incidente_id" value={formData.incidente_id} onChange={handleInputChange} required className="mt-1 block w-full rounded-md border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white focus:border-red-500 focus:ring-red-500">
                            <option value="">Selecciona un tipo...</option>
                            {tiposIncidente.map(tipo => <option key={tipo.id} value={tipo.id}>{tipo.tipo_incid}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Fecha del Incidente</label>
                        <input type="date" name="fecha_ocurrencia" value={formData.fecha_ocurrencia} onChange={handleInputChange} required className="mt-1 block w-full rounded-md border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white focus:border-red-500 focus:ring-red-500" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Descripción del Incidente</label>
                        <textarea name="descripcion" value={formData.descripcion} onChange={handleInputChange} required rows="4" className="mt-1 block w-full rounded-md border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white focus:border-red-500 focus:ring-red-500"></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Empleados Involucrados</label>
                        <div className="mt-2 p-2 border rounded-lg max-h-48 overflow-y-auto space-y-1 bg-white border-gray-300 dark:bg-gray-700/50 dark:border-gray-600">
                            {allEmpleados.map(empleado => (
                                <label key={empleado.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                                    <input type="checkbox" value={empleado.id} checked={formData.empleado_ids.includes(empleado.id)} onChange={handleCheckboxChange} className="form-checkbox h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500" />
                                    <span className="font-medium text-sm text-gray-900 dark:text-white">{empleado.nombre} {empleado.apellido} (DNI: {empleado.dni})</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Observaciones</label>
                        <textarea name="observaciones" value={formData.observaciones} onChange={handleInputChange} rows="4" className="mt-1 block w-full rounded-md border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white focus:border-red-500 focus:ring-red-500"></textarea>
                    </div>
                    
                    <div className="mt-8 pt-4 border-t dark:border-gray-700 flex justify-end gap-3">
                        <Link to={`/incidentes/${id}`} className="px-4 py-2 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50">Cancelar</Link>
                        <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-400">
                            {isSubmitting ? 'Guardando...' : 'Guardar Corrección'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CorregirIncidente;