import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getEmpleadosBasico, getTiposSancion, aplicarSancionEmpleado } from '../../services/api';
import { ArrowLeft, Search, ShieldAlert, Loader } from 'lucide-react';

const AgregarSancion = () => {
    const [empleados, setEmpleados] = useState([]);
    const [tiposSancion, setTiposSancion] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedEmpleado, setSelectedEmpleado] = useState(null);
    
    // Estados del formulario
    const [sancionId, setSancionId] = useState('');
    const [motivo, setMotivo] = useState('');
    const [fechaInicio, setFechaInicio] = useState(new Date().toISOString().split('T')[0]);
    const [fechaFin, setFechaFin] = useState('');

    // Estados de UI
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [empleadosRes, tiposSancionRes] = await Promise.all([
                    getEmpleadosBasico(),
                    getTiposSancion()
                ]);
                setEmpleados(empleadosRes.data);
                console.log('Tipos de sanción obtenidos:', tiposSancionRes.data);
                setTiposSancion(tiposSancionRes.data);
            } catch (err) {
                setError('Error al cargar los datos iniciales. Inténtalo de nuevo.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredEmpleados = useMemo(() => {
        if (!searchTerm) return [];
        return empleados.filter(emp =>
            emp.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.dni.toString().includes(searchTerm)
        ).slice(0, 5); // Limitar a 5 resultados para no saturar la UI
    }, [searchTerm, empleados]);

    const handleSelectEmpleado = (empleado) => {
        setSelectedEmpleado(empleado);
        setSearchTerm('');
    };

    const resetForm = () => {
        setSelectedEmpleado(null);
        setSancionId('');
        setMotivo('');
        setFechaInicio(new Date().toISOString().split('T')[0]);
        setFechaFin('');
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedEmpleado || !sancionId || !motivo || !fechaInicio) {
            setError('Por favor, completa todos los campos requeridos.');
            return;
        }

        setIsSubmitting(true);
        setError('');
        setSuccess('');

        const sancionData = {
            empleado_id: selectedEmpleado.id,
            sancion_id: sancionId,
            motivo,
            fecha_inicio: fechaInicio,
        };

        if (fechaFin) {
            sancionData.fecha_fin = fechaFin;
        }

        try {
            await aplicarSancionEmpleado(sancionData);
            setSuccess(`Sanción aplicada con éxito a ${selectedEmpleado.nombre} ${selectedEmpleado.apellido}. Redirigiendo...`);
            setTimeout(() => {
                navigate('/sanciones');
            }, 2000);
        } catch (err) {
            setError('Error al aplicar la sanción. Revisa los datos e inténtalo de nuevo.');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <Link to="/sanciones" className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500 mb-6">
                <ArrowLeft size={16} /> Volver a Sanciones
            </Link>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Aplicar Sanción Directa</h2>

                {error && <p className="mb-4 text-sm text-center text-red-500 bg-red-100 dark:bg-red-900/30 p-3 rounded-lg">{error}</p>}
                {success && <p className="mb-4 text-sm text-center text-green-500 bg-green-100 dark:bg-green-900/30 p-3 rounded-lg">{success}</p>}

                {loading ? (
                    <div className="flex justify-center items-center py-10"><Loader className="animate-spin text-red-600" size={32} /></div>
                ) : !selectedEmpleado ? (
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Buscar Empleado por Nombre o DNI</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Escribe para buscar..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                            />
                        </div>
                        {filteredEmpleados.length > 0 && (
                            <ul className="absolute z-10 w-full bg-white dark:bg-gray-700 border dark:border-gray-600 rounded-lg mt-1 shadow-lg max-h-60 overflow-y-auto">
                                {filteredEmpleados.map(emp => (
                                    <li key={emp.id} onClick={() => handleSelectEmpleado(emp)} className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer text-sm text-gray-900 dark:text-white">
                                        {emp.nombre} {emp.apellido} (DNI: {emp.dni})
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 flex justify-between items-center">
                            <div>
                                <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400">Empleado Seleccionado</h4>
                                <p className="font-bold text-gray-900 dark:text-white">{selectedEmpleado.nombre} {selectedEmpleado.apellido}</p>
                            </div>
                            <button type="button" onClick={resetForm} className="text-sm text-red-600 hover:underline">Cambiar</button>
                        </div>

                        <div>
                            <label htmlFor="sancionId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tipo de Sanción</label>
                            <select
                                id="sancionId"
                                value={sancionId}
                                onChange={(e) => setSancionId(e.target.value)}
                                required
                                className="w-full mt-1 px-4 py-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                            >
                                <option value="" disabled>Seleccione un tipo...</option>
                                {tiposSancion.map(ts => (
                                    <option key={ts.id} value={ts.id}>{ts.nombre}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="motivo" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Motivo</label>
                            <textarea
                                id="motivo"
                                rows="4"
                                value={motivo}
                                onChange={(e) => setMotivo(e.target.value)}
                                required
                                className="w-full mt-1 px-4 py-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                                placeholder="Describe el motivo de la sanción..."
                            ></textarea>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="fechaInicio" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Fecha de Inicio</label>
                                <input
                                    id="fechaInicio"
                                    type="date"
                                    value={fechaInicio}
                                    onChange={(e) => setFechaInicio(e.target.value)}
                                    required
                                    className="w-full mt-1 px-4 py-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white" />
                            </div>
                            <div>
                                <label htmlFor="fechaFin" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Fecha de Fin (Opcional)</label>
                                <input
                                    id="fechaFin"
                                    type="date"
                                    value={fechaFin}
                                    onChange={(e) => setFechaFin(e.target.value)}
                                    min={fechaInicio}
                                    className="w-full mt-1 px-4 py-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white" />
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end">
                            <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center gap-2 disabled:bg-red-400 disabled:cursor-not-allowed">
                                {isSubmitting ? <Loader size={16} className="animate-spin" /> : <ShieldAlert size={16} />}
                                <span>{isSubmitting ? 'Aplicando...' : 'Aplicar Sanción'}</span>
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default AgregarSancion;