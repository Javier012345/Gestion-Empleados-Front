import React, { useState, useEffect } from 'react';
import { ArrowLeft, AlertTriangle, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { getEmpleadosBasico, getTiposIncidente, createIncidenteEmpleado } from '../../services/api';

const RegistrarIncidente = () => {
    const navigate = useNavigate();
    const [tiposIncidente, setTiposIncidente] = useState([]);
    const [empleados, setEmpleados] = useState([]);
    const [formData, setFormData] = useState({
        incidente_id: '',
        empleado_ids: [],
        fecha_ocurrencia: '',
        descripcion: '',
        observaciones: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [tiposRes, empleadosRes] = await Promise.all([
                    getTiposIncidente(),
                    getEmpleadosBasico()
                ]);
                setTiposIncidente(tiposRes.data);
                setEmpleados(empleadosRes.data);
            } catch (err) {
                setError('Error al cargar los datos necesarios para el formulario.');
                console.error(err);
            }
        };
        fetchData();
    }, []);

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
        console.log('Datos a enviar a la API:', formData);

        try {
            await createIncidenteEmpleado(formData);
            setSuccess('Incidente registrado con éxito.');
            setTimeout(() => navigate('/incidentes'), 2000);
        } catch (err) {
            setError('Error al registrar el incidente. Inténtalo de nuevo.');
            console.error('Error creating incident:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <Link to="/incidentes" className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500 mb-6">
                <ArrowLeft size={16} /> Volver a Incidentes
            </Link>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Registrar Nuevo Incidente</h2>

                {success && (
                    <div className="mb-4 flex items-center gap-3 rounded-lg bg-green-50 dark:bg-green-900/20 p-4 text-sm text-green-700 dark:text-green-300">
                        <CheckCircle className="h-5 w-5" />
                        <p>{success}</p>
                    </div>
                )}
                {error && (
                    <div className="mb-4 flex items-center gap-3 rounded-lg bg-red-50 dark:bg-red-900/20 p-4 text-sm text-red-700 dark:text-red-300">
                        <AlertTriangle className="h-5 w-5" />
                        <p>{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tipo de Incidente</label>
                        <select name="incidente_id" value={formData.incidente_id} onChange={handleInputChange} required className="mt-1 block w-full rounded-md border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white focus:border-red-500 focus:ring-red-500">
                            <option value="">Selecciona un tipo...</option>
                            {tiposIncidente.map(tipo => (
                                <option key={tipo.id} value={tipo.id}>{tipo.tipo_incid}</option>
                            ))}
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
                            {empleados.map(empleado => (
                                <label key={empleado.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                                    <input type="checkbox" value={empleado.id} onChange={handleCheckboxChange} className="form-checkbox h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500" />
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
                        <Link to="/incidentes" className="px-4 py-2 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50">Cancelar</Link>
                        <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-400">
                            {isSubmitting ? 'Guardando...' : 'Guardar Incidente'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegistrarIncidente;