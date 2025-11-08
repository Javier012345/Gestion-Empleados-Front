
import React, { useState, useEffect } from 'react';
import { Search, Upload, User, Filter, FileText, Image, Edit, X } from 'lucide-react';

// --- Mock Data ---
const mockEmpleados = {
    "12345678": {
        nombre: "Juan",
        apellido: "Perez",
        recibos: [
            { id: 1, fecha_emision: "2023-10-15", periodo: "2023-09", ruta_pdf: "/recibos/juan_perez_09_2023.pdf", ruta_imagen: null },
            { id: 2, fecha_emision: "2023-09-15", periodo: "2023-08", ruta_pdf: "/recibos/juan_perez_08_2023.pdf", ruta_imagen: "/recibos/juan_perez_08_2023.jpg" },
        ]
    },
    "87654321": {
        nombre: "Maria",
        apellido: "Gomez",
        recibos: [
            { id: 3, fecha_emision: "2023-10-15", periodo: "2023-09", ruta_pdf: "/recibos/maria_gomez_09_2023.pdf", ruta_imagen: null },
        ]
    }
};

const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

// --- Sub-componente: Modal de Carga ---
const UploadReciboModal = ({ isOpen, onClose, employeeDNI }) => {
    const [formData, setFormData] = useState({
        dni: employeeDNI || '',
        fecha_emision: '',
        periodo: '',
        ruta_pdf: null,
        ruta_imagen: null
    });

    // Mover la condición después de los hooks
    if (!isOpen) return null;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setFormData(prev => ({ ...prev, [name]: files[0] }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Aquí iría la lógica para subir los datos y el archivo a la API
        console.log("Datos a enviar:", formData);
        onClose(); // Cerrar modal después de enviar
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg p-6 m-4" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-semibold">Cargar Nuevo Recibo</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"><X size={20} /></button>
                </div>
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <div>
                        <label htmlFor="dni" className="block text-sm font-medium text-gray-700 dark:text-gray-300">DNI del Empleado</label>
                        <input type="text" name="dni" id="dni" value={formData.dni} onChange={handleInputChange} required
                               className="mt-1 block w-full rounded-md border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-700 shadow-sm" />
                    </div>
                    <div>
                        <label htmlFor="fecha_emision" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Fecha de Emisión</label>
                        <input type="date" name="fecha_emision" id="fecha_emision" value={formData.fecha_emision} onChange={handleInputChange} required
                               className="mt-1 block w-full rounded-md border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-700 shadow-sm" />
                    </div>
                    <div>
                        <label htmlFor="periodo" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Período (YYYY-MM)</label>
                        <input type="text" name="periodo" id="periodo" placeholder="2023-10" value={formData.periodo} onChange={handleInputChange} required
                               className="mt-1 block w-full rounded-md border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-700 shadow-sm" />
                    </div>
                    <div>
                        <label htmlFor="ruta_pdf" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Archivo PDF</label>
                        <input type="file" name="ruta_pdf" id="ruta_pdf" onChange={handleFileChange} accept=".pdf"
                               className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"/>
                    </div>
                     <div>
                        <label htmlFor="ruta_imagen" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Archivo de Imagen</label>
                        <input type="file" name="ruta_imagen" id="ruta_imagen" onChange={handleFileChange} accept="image/*"
                               className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
                    </div>
                    <div className="pt-4 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500">Cancelar</button>
                        <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Guardar Recibo</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- Componente Principal: Recibos ---
const Recibos = () => {
    const [dni, setDni] = useState('');
    const [searchedDni, setSearchedDni] = useState('');
    const [empleado, setEmpleado] = useState(null);
    const [recibos, setRecibos] = useState([]);
    const [filteredRecibos, setFilteredRecibos] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isUploadModalOpen, setUploadModalOpen] = useState(false);

    const [filters, setFilters] = useState({ mes: '', anio: '' });
    const [availableYears, setAvailableYears] = useState([]);

    const handleSearch = () => {
        setIsLoading(true);
        setError('');
        setEmpleado(null);
        setRecibos([]);

        // Simular llamada a la API
        setTimeout(() => {
            const foundEmpleado = mockEmpleados[dni];
            if (foundEmpleado) {
                setEmpleado({ nombre: foundEmpleado.nombre, apellido: foundEmpleado.apellido });
                setRecibos(foundEmpleado.recibos);
                setFilteredRecibos(foundEmpleado.recibos);
                const years = [...new Set(foundEmpleado.recibos.map(r => new Date(r.fecha_emision).getFullYear()))];
                setAvailableYears(years.sort((a, b) => b - a));
                setFilters({ mes: '', anio: years[0] || '' });
            } else {
                setError('No se encontró ningún empleado con el DNI proporcionado.');
            }
            setSearchedDni(dni);
            setIsLoading(false);
        }, 500);
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
        }
    }, [filters, recibos]);


    return (
        <>
            {/* Barra de búsqueda y botón */}
            <div className="flex flex-col sm:flex-row gap-4 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="relative flex-1 max-w-sm">
                    <div className="relative">
                        <input 
                            type="text" 
                            inputMode="numeric" 
                            pattern="[0-9]*" 
                            placeholder="Buscar por DNI..." 
                            maxLength="8"
                            value={dni}
                            onChange={(e) => setDni(e.target.value.replace(/[^0-9]/g, ''))}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            className="block w-full pl-10 pr-12 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="w-5 h-5 text-gray-400" />
                        </div>
                        <button 
                            onClick={handleSearch}
                            className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-red-500 transition-colors duration-200"
                        >
                            <Search className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                <button onClick={() => setUploadModalOpen(true)} className="flex-shrink-0 inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 hover:shadow-lg hover:scale-105">
                    <Upload className="w-5 h-5" />
                    <span>Cargar Recibo</span>
                </button>
            </div>

            {/* Contenedor de resultados */}
            {isLoading && <div className="text-center p-8">Buscando...</div>}
            {error && <div className="text-center p-8 text-red-500">{error}</div>}
            
            {!isLoading && !error && empleado && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-bold">Resultados para {empleado.nombre} {empleado.apellido}</h2>
                    </div>
                    {/* Filtros */}
                    <div className="p-4 bg-gray-50 dark:bg-gray-900 border-b dark:border-gray-700">
                        <div className="flex flex-wrap items-end gap-4">
                            <div className="w-32">
                                <label htmlFor="mes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Mes</label>
                                <select name="mes" id="mes" value={filters.mes} onChange={(e) => setFilters({...filters, mes: e.target.value})}
                                    className="mt-1 block w-full pl-3 pr-8 py-2 text-sm border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500">
                                    <option value="">Todos</option>
                                    {meses.map((m, i) => <option key={i} value={i+1}>{m}</option>)}
                                </select>
                            </div>
                            <div className="w-28">
                                <label htmlFor="anio" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Año</label>
                                <select name="anio" id="anio" value={filters.anio} onChange={(e) => setFilters({...filters, anio: e.target.value})}
                                    className="mt-1 block w-full pl-3 pr-8 py-2 text-sm border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500">
                                    {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>
                    {/* Lista de Recibos */}
                    <RecibosList recibos={filteredRecibos} />
                </div>
            )}

            {!isLoading && !searchedDni && (
                 <div className="py-12 px-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="max-w-sm mx-auto text-center">
                        <div className="inline-flex p-4 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
                            <Search className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                        </div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Buscar recibos de sueldo</h3>
                        <p className="text-sm text-gray-500">Ingresa un DNI para ver los recibos de un empleado.</p>
                    </div>
                </div>
            )}

            <UploadReciboModal 
                isOpen={isUploadModalOpen} 
                onClose={() => setUploadModalOpen(false)} 
                employeeDNI={searchedDni} 
            />
        </>
    );
};


// --- Sub-componente: Lista de Recibos ---
const RecibosList = ({ recibos }) => {
    if (recibos.length === 0) {
        return <div className="text-center py-10 px-6"><p className="text-gray-500">No se encontraron recibos para los filtros seleccionados.</p></div>;
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
                                        <a href={recibo.ruta_pdf} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-3 py-1.5 text-sm text-red-600 hover:text-red-700 bg-red-50 dark:bg-red-900/20 rounded-lg transition-colors duration-200 hover:bg-red-100 dark:hover:bg-red-900/30">
                                            <FileText className="w-4 h-4" />
                                            <span>PDF</span>
                                        </a>
                                    )}
                                    {recibo.ruta_imagen && (
                                        <a href={recibo.ruta_imagen} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-3 py-1.5 text-sm text-blue-600 hover:text-blue-700 bg-blue-50 dark:bg-blue-900/20 rounded-lg transition-colors duration-200 hover:bg-blue-100 dark:hover:bg-blue-900/30">
                                            <Image className="w-4 h-4" />
                                            <span>Imagen</span>
                                        </a>
                                    )}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <button className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-500 transition-colors duration-200">
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
