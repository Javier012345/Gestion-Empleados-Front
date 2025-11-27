
import React, { useState, useEffect, useMemo } from 'react';
import { Search, Upload, User, FileText, Image, Edit, X, Loader, AlertCircle } from 'lucide-react';
import { getRecibosByDni, getEmpleadoById, createRecibo, getEmpleadosBasico, updateRecibo } from '../../services/api';


const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

// --- Sub-componente: Modal de Carga ---
const UploadReciboModal = ({ isOpen, onClose, empleados, onUploadSuccess }) => {
    const [formData, setFormData] = useState({
        id_empl: '',
        fecha_emision: '',
        periodo: '',
        ruta_pdf: null,
        ruta_imagen: null
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadError, setUploadError] = useState('');

    useEffect(() => {
        if (isOpen) {
            setFormData({
                id_empl: '',
                fecha_emision: '',
                periodo: '',
                ruta_pdf: null,
                ruta_imagen: null
            });
            setUploadError('');
        }
    }, [isOpen]);
    // Mover la condición después de los hooks
    if (!isOpen) return null;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'periodo') {
            const filteredValue = value.replace(/[^0-9-]/g, '');
            setFormData(prev => ({ ...prev, [name]: filteredValue }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setFormData(prev => ({ ...prev, [name]: files[0] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { id_empl, fecha_emision, periodo, ruta_pdf, ruta_imagen } = formData;
        if (!id_empl || !fecha_emision || !periodo || !ruta_pdf || !ruta_imagen) {
            setUploadError("Debe completar todos los campos.");
            return;
        }

        // Validación de formato de período
        const periodoRegex = /^\d{4}-\d{2}$/;
        if (!periodoRegex.test(periodo)) {
            setUploadError("El formato del período debe ser YYYY-MM.");
            return;
        }

        // Nueva validación para el mes
        const [, month] = periodo.split('-');
        const monthInt = parseInt(month, 10);
        if (monthInt < 1 || monthInt > 12) {
            setUploadError("El mes en el período debe estar entre 01 y 12.");
            return;
        }

        setIsSubmitting(true);
        setUploadError('');

        const data = new FormData();
        data.append('id_empl', formData.id_empl);
        data.append('fecha_emision', formData.fecha_emision);
        data.append('periodo', formData.periodo);
        data.append('ruta_pdf', formData.ruta_pdf);
        data.append('ruta_imagen', formData.ruta_imagen);

        try {
            await createRecibo(data);
            onUploadSuccess();
        } catch (error) {
            setUploadError('Error al subir el recibo. Inténtalo de nuevo.');
            console.error("Error creating receipt:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg p-6 m-4" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Cargar Nuevo Recibo</h2>
                    <button onClick={onClose} className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"><X size={20} /></button>
                </div>
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <div>
                        <label htmlFor="id_empl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Empleado</label>
                        <select
                            name="id_empl"
                            id="id_empl"
                            value={formData.id_empl}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-700 text-gray-900 dark:text-gray-200 shadow-sm focus:border-red-500 focus:ring-red-500"
                        >
                            <option value="">Selecciona un empleado</option>
                            {empleados.map(emp => (
                                <option key={emp.id} value={emp.id}>{emp.nombre} {emp.apellido} (DNI: {emp.dni})</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="fecha_emision" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Fecha de Emisión</label>
                        <input type="date" name="fecha_emision" id="fecha_emision" value={formData.fecha_emision} onChange={handleInputChange}
                               className="mt-1 block w-full rounded-md border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-700 text-gray-900 dark:text-gray-200 shadow-sm" />
                    </div>
                    <div>
                        <label htmlFor="periodo" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Período (YYYY-MM)</label>
                        <input type="text" name="periodo" id="periodo" placeholder="2023-10" value={formData.periodo} onChange={handleInputChange}
                               className="mt-1 block w-full rounded-md border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-700 text-gray-900 dark:text-gray-200 shadow-sm" />
                    </div>
                    <div>
                        <label htmlFor="ruta_pdf" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Archivo PDF</label>
                        <input type="file" name="ruta_pdf" id="ruta_pdf" onChange={handleFileChange} accept=".pdf"
                               className="mt-1 block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 dark:file:bg-red-900/40 file:text-red-700 dark:file:text-red-300 hover:file:bg-red-100 dark:hover:file:bg-red-900/60"/>
                    </div>
                     <div>
                        <label htmlFor="ruta_imagen" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Archivo de Imagen</label>
                        <input type="file" name="ruta_imagen" id="ruta_imagen" onChange={handleFileChange} accept="image/*"
                               className="mt-1 block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 dark:file:bg-blue-900/40 file:text-blue-700 dark:file:text-blue-300 hover:file:bg-blue-100 dark:hover:file:bg-blue-900/60"/>
                    </div>
                    <div className="pt-4 flex justify-end gap-3">
                        <button type="button" onClick={onClose} disabled={isSubmitting} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 disabled:opacity-50">Cancelar</button>
                        <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-400">
                            {isSubmitting ? 'Guardando...' : 'Guardar Recibo'}
                        </button>
                    </div>
                    {uploadError && (
                        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 rounded-lg">
                            <div className="flex items-center gap-3">
                                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                                <p className="text-sm text-red-700 dark:text-red-300">{uploadError}</p>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

// --- Sub-componente: Modal de Edición ---
const EditReciboModal = ({ isOpen, onClose, recibo, onUpdateSuccess }) => {
    const [formData, setFormData] = useState({});
    const [originalData, setOriginalData] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadError, setUploadError] = useState('');

    useEffect(() => {
        if (isOpen && recibo) {
            const data = {
                fecha_emision: recibo.fecha_emision,
                periodo: recibo.periodo,
                ruta_pdf: null, // Se manejan por separado
                ruta_imagen: null,
            };
            setFormData(data);
            setOriginalData(data);
            setUploadError('');
        }
    }, [isOpen, recibo]);

    if (!isOpen || !recibo) return null;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'periodo') {
            const filteredValue = value.replace(/[^0-9-]/g, '');
            setFormData(prev => ({ ...prev, [name]: filteredValue }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setFormData(prev => ({ ...prev, [name]: files[0] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { fecha_emision, periodo } = formData;
        if (!fecha_emision || !periodo) {
            setUploadError("Debe completar todos los campos.");
            return;
        }

        // Validación de formato de período
        const periodoRegex = /^\d{4}-\d{2}$/;
        if (!periodoRegex.test(periodo)) {
            setUploadError("El formato del período debe ser YYYY-MM.");
            return;
        }

        // Nueva validación para el mes
        const [, month] = periodo.split('-');
        const monthInt = parseInt(month, 10);
        if (monthInt < 1 || monthInt > 12) {
            setUploadError("El mes en el período debe estar entre 01 y 12.");
            return;
        }

        const hasFileChanges = formData.ruta_pdf || formData.ruta_imagen;
        const hasFieldChanges = formData.fecha_emision !== originalData.fecha_emision || formData.periodo !== originalData.periodo;
        if (!hasFileChanges && !hasFieldChanges) {
            setUploadError("No se ha realizado ningún cambio.");
            setIsSubmitting(false);
            return;
        }

        setIsSubmitting(true);
        setUploadError('');

        const data = new FormData();
        // Compara y añade solo los campos modificados
        Object.keys(formData).forEach(key => {
            if (formData[key] !== originalData[key] && formData[key] !== null) {
                data.append(key, formData[key]);
            }
        });

        try {
            await updateRecibo(recibo.id, data);
            onUpdateSuccess();
        } catch (error) {
            setUploadError("Error al actualizar el recibo. Inténtalo de nuevo.");
            console.error("Error updating receipt:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg p-6 m-4" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Editar Recibo</h2>
                    <button onClick={onClose} className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"><X size={20} /></button>
                </div>
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    {/* Los campos son similares al modal de carga, pero sin el selector de empleado */}
                    <div>
                        <label htmlFor="fecha_emision_edit" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Fecha de Emisión</label>
                        <input type="date" name="fecha_emision" id="fecha_emision_edit" value={formData.fecha_emision || ''} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-700 text-gray-900 dark:text-gray-200 shadow-sm" />
                    </div>
                    <div>
                        <label htmlFor="periodo_edit" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Período (YYYY-MM)</label>
                        <input type="text" name="periodo" id="periodo_edit" placeholder="2023-10" value={formData.periodo || ''} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-700 text-gray-900 dark:text-gray-200 shadow-sm" />
                    </div>
                    <div>
                        <label htmlFor="ruta_pdf_edit" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Reemplazar PDF</label>
                        {recibo.ruta_pdf && (
                            <div className="mt-2 mb-3">
                                <a href={recibo.ruta_pdf} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-red-600 hover:text-red-700 bg-red-50 dark:bg-red-900/20 rounded-lg transition-colors duration-200 hover:bg-red-100 dark:hover:bg-red-900/30 dark:text-red-300 dark:hover:text-red-200">
                                    <FileText className="w-4 h-4" />
                                    <span>Ver PDF Actual</span>
                                </a>
                            </div>
                        )}
                        <input type="file" name="ruta_pdf" id="ruta_pdf_edit" onChange={handleFileChange} accept=".pdf" className="mt-1 block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 dark:file:bg-red-900/40 file:text-red-700 dark:file:text-red-300 hover:file:bg-red-100 dark:hover:file:bg-red-900/60"/>
                    </div>
                    <div>
                        <label htmlFor="ruta_imagen_edit" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Reemplazar Imagen</label>
                        {recibo.ruta_imagen && (
                            <div className="mt-2 mb-3">
                                <a href={recibo.ruta_imagen} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-blue-600 hover:text-blue-700 bg-blue-50 dark:bg-blue-900/20 rounded-lg transition-colors duration-200 hover:bg-blue-100 dark:hover:bg-blue-900/30 dark:text-blue-300 dark:hover:text-blue-200">
                                    <Image className="w-4 h-4" />
                                    <span>Ver Imagen Actual</span>
                                </a>
                            </div>
                        )}
                        <input type="file" name="ruta_imagen" id="ruta_imagen_edit" onChange={handleFileChange} accept="image/*" className="mt-1 block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 dark:file:bg-blue-900/40 file:text-blue-700 dark:file:text-blue-300 hover:file:bg-blue-100 dark:hover:file:bg-blue-900/60"/>
                    </div>
                    <div className="pt-4 flex justify-end gap-3">
                        <button type="button" onClick={onClose} disabled={isSubmitting} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 disabled:opacity-50">Cancelar</button>
                        <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-400">
                            {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    </div>
                    {uploadError && (
                        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 rounded-lg">
                            <div className="flex items-center gap-3">
                                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                                <p className="text-sm text-red-700 dark:text-red-300">{uploadError}</p>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

// --- Componente Principal: Recibos ---
const Recibos = () => {
    const [searchedDni, setSearchedDni] = useState('');
    const [empleado, setEmpleado] = useState(null);
    const [recibos, setRecibos] = useState([]);
    const [filteredRecibos, setFilteredRecibos] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isUploadModalOpen, setUploadModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [reciboToEdit, setReciboToEdit] = useState(null);
    const [allEmpleados, setAllEmpleados] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedEmpleado, setSelectedEmpleado] = useState(null);


    const [filters, setFilters] = useState({ mes: '', anio: '' });
    const [availableYears, setAvailableYears] = useState([]);

    const filteredEmpleados = useMemo(() => {
        if (!searchTerm) return [];
        return (allEmpleados || []).filter(emp => 
            emp.dni.toString().startsWith(searchTerm)
        ).slice(0, 5); // Mostramos solo los primeros 5 resultados
    }, [searchTerm, allEmpleados]);

    useEffect(() => {
        const fetchAllEmpleados = async () => {
            try {
                const response = await getEmpleadosBasico();
                setAllEmpleados(response.data);
            } catch (error) {
                console.error("Error fetching employees list:", error);
            }
        };
        fetchAllEmpleados();
    }, []);

    const handleUploadSuccess = () => {
        setUploadModalOpen(false);
        if (searchedDni) handleSearch(searchedDni);
    };

    const handleUpdateSuccess = () => {
        setEditModalOpen(false);
        setReciboToEdit(null);
        if (searchedDni) handleSearch(searchedDni);
    };

    const handleOpenEditModal = (recibo) => {
        setReciboToEdit(recibo);
        setEditModalOpen(true);
    };

    const handleSelectEmpleado = async (empleado) => {
        setSelectedEmpleado(empleado);
        setSearchTerm(''); // Limpia la búsqueda
        await handleSearch(empleado.dni);
    };

    const handleSearch = async (searchDni) => {
        if (!searchDni) {
            setError('Por favor, ingresa un DNI para buscar.');
            return;
        }
        setIsLoading(true);
        setError('');
        setEmpleado(null);
        setRecibos([]);
        setFilteredRecibos([]);
        setSearchedDni(searchDni);

        try {
            const recibosResponse = await getRecibosByDni(searchDni);
            const recibosData = recibosResponse.data;

            if (recibosData && recibosData.length > 0) {
                const employeeId = recibosData[0].id_empl;
                const empleadoResponse = await getEmpleadoById(employeeId);
                const empleadoData = empleadoResponse.data;

                setEmpleado({ nombre: empleadoData.nombre, apellido: empleadoData.apellido });
                setRecibos(recibosData);
                setFilteredRecibos(recibosData);
                const years = [...new Set(recibosData.map(r => new Date(r.fecha_emision).getFullYear()))];
                setAvailableYears(years.sort((a, b) => b - a));
                setFilters({ mes: '', anio: years[0] || '' });
            } else {
                setError('No se encontraron recibos para el DNI proporcionado.');
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setError('No se encontró ningún empleado con el DNI proporcionado.');
            } else {
                setError('Ocurrió un error al buscar los recibos. Inténtalo de nuevo.');
                console.error("Error fetching receipts:", error);
            }
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        if(recibos.length > 0) {
            const filtered = recibos.filter(r => {
                const fecha = new Date(r.fecha_emision);
                const mesMatch = filters.mes ? (fecha.getMonth() + 1) === parseInt(filters.mes) : true;
                const anioMatch = filters.anio ? fecha.getFullYear() === parseInt(filters.anio) : true;
                return mesMatch && anioMatch;
            });
            setFilteredRecibos(filtered);
        } else {
            setFilteredRecibos([]);
        }
    }, [filters, recibos]);


    return (
        <>
            {/* Barra de búsqueda y botón */}
            <div className="flex flex-col sm:flex-row gap-4 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
                <div className="relative flex-1 md:max-w-sm">
                    <label htmlFor="search-dni" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Buscar Empleado por DNI
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            {isLoading ? (
                                <Loader className="w-5 h-5 text-gray-400 animate-spin" />
                            ) : (
                                <Search className="w-5 h-5 text-gray-400" />
                            )}
                        </div>
                        <input
                            id="search-dni"
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Comience a escribir el DNI..."
                            className="block w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200"
                        />
                    </div>
                    {filteredEmpleados.length > 0 && (
                        <ul className="absolute z-10 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md mt-1 max-h-60 overflow-y-auto shadow-lg">
                            {filteredEmpleados.map(emp => (
                                <li
                                    key={emp.id}
                                    onClick={() => handleSelectEmpleado(emp)}
                                    className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-gray-900 dark:text-gray-200"
                                >
                                    {`${emp.nombre} ${emp.apellido}`} - {emp.dni}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <div className="flex-shrink-0 self-end">
                    <button onClick={() => setUploadModalOpen(true)} className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 hover:shadow-lg hover:scale-105">
                        <Upload className="w-5 h-5" />
                        <span>Cargar Recibo</span>
                    </button>
                </div>
            </div>

            {/* Contenedor de resultados */}
            {isLoading && (
                <div className="flex justify-center items-center p-10">
                    <Loader className="animate-spin text-red-500" size={48} />
                </div>
            )}

            {error && !isLoading && (
                <div className="flex flex-col items-center justify-center h-64 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 rounded-lg p-6">
                    <AlertCircle size={48} className="mb-4" />
                    <h2 className="text-xl font-semibold mb-2">Error</h2>
                    <p>{error}</p>
                </div>
            )}
            
            {!isLoading && !error && empleado && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden animate-fade-in">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                            Recibos de <span className="text-red-600">{empleado.nombre} {empleado.apellido}</span>
                        </h2>
                    </div>
                    {/* Filtros */}
                    <div className="p-4 bg-gray-50 dark:bg-gray-900/50 border-b dark:border-gray-700">
                        <div className="flex flex-wrap items-end gap-4">
                            <div className="w-32">
                                <label htmlFor="mes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Mes</label>
                                <select name="mes" id="mes" value={filters.mes} onChange={(e) => setFilters({...filters, mes: e.target.value})}
                                    className="mt-1 block w-full pl-3 pr-8 py-2 text-sm border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500">
                                    <option value="">Todos</option>
                                    {meses.map((m, i) => <option key={i} value={i+1}>{m}</option>)}
                                </select>
                            </div>
                            <div className="w-28">
                                <label htmlFor="anio" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Año</label>
                                <select name="anio" id="anio" value={filters.anio} onChange={(e) => setFilters({...filters, anio: e.target.value})}
                                    className="mt-1 block w-full pl-3 pr-8 py-2 text-sm border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500">
                                    {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>
                    {/* Lista de Recibos */}
                    <RecibosList recibos={filteredRecibos} onEdit={handleOpenEditModal} />
                </div>
            )}

            {!isLoading && !empleado && !error && (
                 <div className="py-12 px-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mt-6">
                    <div className="max-w-sm mx-auto text-center">
                        <div className="inline-flex p-4 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
                            <Search className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Busca un empleado</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Utiliza la barra de búsqueda para encontrar los recibos de sueldo por DNI.</p>
                    </div>
                </div>
            )}

            <UploadReciboModal 
                isOpen={isUploadModalOpen}
                onClose={() => setUploadModalOpen(false)}
                empleados={allEmpleados}
                onUploadSuccess={handleUploadSuccess}
            />

            <EditReciboModal
                isOpen={isEditModalOpen}
                onClose={() => setEditModalOpen(false)}
                recibo={reciboToEdit}
                onUpdateSuccess={handleUpdateSuccess}
            />
        </>
    );
};


// --- Sub-componente: Lista de Recibos ---
const RecibosList = ({ recibos, onEdit }) => {
    if (recibos.length === 0) {
        return <div className="text-center py-10 px-6"><p className="text-gray-500 dark:text-gray-400">No se encontraron recibos para los filtros seleccionados.</p></div>;
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                    <tr className="text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                        <th scope="col" className="px-6 py-3 whitespace-nowrap">Fecha de Emisión</th>
                        <th scope="col" className="px-6 py-3 whitespace-nowrap">Período</th>
                        <th scope="col" className="px-6 py-3 whitespace-nowrap">Archivos</th>
                        <th scope="col" className="px-6 py-3 whitespace-nowrap">Acciones</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                    {recibos.map(recibo => (
                        <tr key={recibo.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                                {new Date(recibo.fecha_emision).toLocaleDateString('es-AR', { timeZone: 'UTC' })}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">{recibo.periodo}</td>
                            <td className="px-6 py-4">
                                <div className="flex flex-wrap gap-2">
                                    {recibo.ruta_pdf && (
                                        <a href={recibo.ruta_pdf} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-3 py-1.5 text-sm text-red-600 hover:text-red-700 bg-red-50 dark:bg-red-900/20 rounded-lg transition-colors duration-200 hover:bg-red-100 dark:hover:bg-red-900/30 dark:text-red-300 dark:hover:text-red-200">
                                            <FileText className="w-4 h-4" />
                                            <span>PDF</span>
                                        </a>
                                    )}
                                    {recibo.ruta_imagen && (
                                        <a href={recibo.ruta_imagen} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-3 py-1.5 text-sm text-blue-600 hover:text-blue-700 bg-blue-50 dark:bg-blue-900/20 rounded-lg transition-colors duration-200 hover:bg-blue-100 dark:hover:bg-blue-900/30 dark:text-blue-300 dark:hover:text-blue-200">
                                            <Image className="w-4 h-4" />
                                            <span>Imagen</span>
                                        </a>
                                    )}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <button onClick={() => onEdit(recibo)} className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-500 transition-colors duration-200">
                                    <Edit className="w-4 h-4" />
                                    <span>Editar</span>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Recibos;
