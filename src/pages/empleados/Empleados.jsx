import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Search, Printer, Plus, Eye, Edit2, Trash2, MoreHorizontal, ChevronLeft, ChevronRight, Users, AlertCircle, Loader } from 'lucide-react';
import ConfirmDeleteModal from '../../components/modals/ConfirmDeleteModal';
import { getEmpleados, deleteEmpleado } from '../../services/api'; // Importar la función de la API

const estado_choices = [
    ['Activo', 'Activo'],
    ['Inactivo', 'Inactivo'],
];

// --- Componente de Controles ---
const EmployeeControls = ({ searchTerm, onSearchChange, estadoFilter, onEstadoChange, cargoFilter, onCargoChange, cargos }) => {
    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <div className="w-full md:w-auto flex flex-col md:flex-row items-center gap-3">
                <div className="relative w-full md:max-w-xs group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 transition-colors group-hover:text-red-500" />
                    <input 
                        type="text" 
                        placeholder="Buscar por nombre o DNI..." 
                        value={searchTerm}
                        onChange={onSearchChange}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200"
                    />
                </div>
                <div className="w-full md:w-auto flex flex-col sm:flex-row gap-2">
                    <select 
                        value={estadoFilter}
                        onChange={onEstadoChange}
                        className="w-full sm:w-auto py-2.5 px-4 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500 cursor-pointer transition-all duration-200 hover:border-red-500/50">
                        <option value="">Todos los Estados</option>
                        {estado_choices.map(([value, display]) => <option key={value} value={value}>{display}</option>)}
                    </select>
                    <select 
                        value={cargoFilter}
                        onChange={onCargoChange}
                        className="w-full sm:w-auto py-2.5 px-4 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500 cursor-pointer transition-all duration-200 hover:border-red-500/50">
                        <option value="">Todos los Cargos</option>
                        {cargos.map(cargo => <option key={cargo} value={cargo}>{cargo}</option>)}
                    </select>
                </div>
            </div>
            <div className="w-full md:w-auto flex flex-col sm:flex-row items-center gap-3">
                <button 
                    onClick={handlePrint}
                    className="w-full sm:w-auto flex-shrink-0 bg-gray-600 text-white px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-700 text-sm font-medium transition-all duration-200 hover:shadow-lg hover:scale-105">
                    <Printer size={16} /> Imprimir Lista
                </button>
                <Link 
                    to="/empleados/crear" 
                    className="w-full sm:w-auto flex-shrink-0 bg-red-600 text-white px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-red-700 font-medium transition-all duration-200 hover:shadow-lg hover:scale-105">
                    <Plus size={20} /><span>Registrar Empleado</span>
                </Link>
            </div>
        </div>
    );
};

// --- Componente de Acciones ---
const EmployeeActions = ({ empleado, onDeactivateClick }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [menuPositionClass, setMenuPositionClass] = useState('top-full');
    const buttonRef = useRef(null);

    const handleMouseEnter = () => {
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            if (spaceBelow < 130) { // Approx height of the menu
                setMenuPositionClass('bottom-full');
            } else {
                setMenuPositionClass('top-full');
            }
        }
        setMenuOpen(true);
    };

    return (
        <div className="relative" onMouseLeave={() => setMenuOpen(false)}>
            <button ref={buttonRef} onMouseEnter={handleMouseEnter} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                <MoreHorizontal className="text-gray-500 dark:text-gray-400" />
            </button>
            {menuOpen && (
                <div className={`absolute ${menuPositionClass} right-0 w-48 bg-white dark:bg-gray-900 rounded-md shadow-lg z-50 border dark:border-gray-700 py-1`}>
                    <Link to={`/empleados/${empleado.id}`} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
                        <Eye size={16} />Ver Perfil
                    </Link>
                    <Link to={`/empleados/editar/${empleado.id}`} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
                        <Edit2 size={16} />Editar
                    </Link>
                    <button onClick={() => onDeactivateClick(empleado)} className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/50 w-full text-left">
                        <Trash2 size={16} />Eliminar
                    </button>
                </div>
            )}
        </div>
    );
};

// --- Componente Principal ---
const Empleados = () => {
    const [empleados, setEmpleados] = useState([]);
    const [cargos, setCargos] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [estadoFilter, setEstadoFilter] = useState('');
    const [cargoFilter, setCargoFilter] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Estado para el modal de eliminación
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    // Estado para la paginación
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    useEffect(() => {
        const fetchEmpleados = async () => {
            try {
                setLoading(true);
                const response = await getEmpleados();
                setEmpleados(response.data);
                // Establecer los cargos de forma estática
                setCargos(['Administrador', 'Empleado']);
                setError(null);
            } catch (err) {
                setError('No se pudieron cargar los empleados. Por favor, intente de nuevo más tarde.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchEmpleados();
    }, []);

    const handleOpenModal = (empleado) => {
        setSelectedEmployee(empleado);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedEmployee(null);
    };

    const handleConfirmDelete = async () => {
        if (!selectedEmployee) return;

        try {
            await deleteEmpleado(selectedEmployee.id);
            // Actualizar el estado del empleado en la lista a 'Inactivo'
            setEmpleados(empleados.map(e => 
                e.id === selectedEmployee.id ? { ...e, estado: 'Inactivo' } : e
            ));
            handleCloseModal();
        } catch (err) {
            // Aquí podrías mostrar una notificación de error al usuario
            console.error('Error al inactivar el empleado:', err);
            alert('No se pudo inactivar al empleado. Intente de nuevo.');
            handleCloseModal();
        }
    };

    const filteredEmpleados = empleados.filter(empleado => {
        const fullName = `${empleado.nombre} ${empleado.apellido}`.toLowerCase();
        const dni = String(empleado.dni).toLowerCase();
        const search = searchTerm.toLowerCase();

        return (
            (fullName.includes(search) || dni.includes(search)) &&
            (estadoFilter === '' || empleado.estado === estadoFilter) &&
            (cargoFilter === '' || empleado.grupo === cargoFilter)
        );
    });

    // Lógica de paginación
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredEmpleados.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredEmpleados.length / itemsPerPage);

    const paginate = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };
    
    const getGroupColorClasses = (groupName) => {
        // Puedes expandir esto con más roles si es necesario
        switch (groupName) {
            case 'Administrador':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
            case 'Empleado':
                return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        }
    };

    const getStatusColorClasses = (status) => {
        return status === 'Activo' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader className="animate-spin text-red-500" size={48} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-64 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 rounded-lg p-6">
                <AlertCircle size={48} className="mb-4" />
                <h2 className="text-xl font-semibold mb-2">Error</h2>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6">
            <EmployeeControls 
                searchTerm={searchTerm}
                onSearchChange={e => setSearchTerm(e.target.value)}
                estadoFilter={estadoFilter}
                onEstadoChange={e => setEstadoFilter(e.target.value)}
                cargoFilter={cargoFilter}
                onCargoChange={e => setCargoFilter(e.target.value)}
                cargos={cargos}
            />

            {/* --- Lista de Empleados (Tabla para md y superior) --- */}
            <div className="hidden md:block overflow-visible bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700/50">
                        <tr className="text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
                            <th className="px-6 py-4">Foto</th>
                            <th className="px-6 py-4">Nombre</th>
                            <th className="px-6 py-4 hidden lg:table-cell">DNI</th>
                            <th className="px-6 py-4 hidden lg:table-cell">Email</th>
                            <th className="px-6 py-4">Cargo</th>
                            <th className="px-6 py-4">Estado</th>
                            <th className="px-6 py-4">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {currentItems.map(empleado => (
                            <tr key={empleado.id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors duration-200">
                                <td className="px-6 py-4">
                                    {empleado.ruta_foto ? (
                                        <img src={empleado.ruta_foto} alt={`${empleado.nombre} ${empleado.apellido}`} className="h-10 w-10 rounded-full object-cover" />
                                    ) : (
                                        <span className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center font-bold text-gray-500">
                                            {empleado.nombre.slice(0, 1)}{empleado.apellido.slice(0, 1)}
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 font-medium text-gray-800 dark:text-gray-100">{empleado.nombre} {empleado.apellido}</td>
                                <td className="px-6 py-4 text-gray-600 dark:text-gray-300 hidden lg:table-cell">{empleado.dni}</td>
                                <td className="px-6 py-4 text-gray-600 dark:text-gray-300 hidden lg:table-cell">{empleado.email}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getGroupColorClasses(empleado.grupo)}`}>
                                        {empleado.grupo || '-'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColorClasses(empleado.estado)}`}>
                                        {empleado.estado}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
    <EmployeeActions empleado={empleado} onDeactivateClick={handleOpenModal} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* --- Lista de Empleados (Tarjetas para móvil) --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
                {currentItems.map(empleado => (
                    <div key={empleado.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                                {empleado.ruta_foto ? (
                                    <img src={empleado.ruta_foto} alt={`${empleado.nombre} ${empleado.apellido}`} className="h-12 w-12 rounded-full object-cover" />
                                 ) : (
                                    <span className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center font-bold text-gray-500 text-xl">
                                        {empleado.nombre.slice(0, 1)}{empleado.apellido.slice(0, 1)}
                                    </span>
                                )}
                                <div className="ml-4">
                                    <p className="font-bold text-gray-800 dark:text-gray-100">{empleado.nombre} {empleado.apellido}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">DNI: {empleado.dni}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{empleado.email}</p>
                                </div>
                            </div>
                            <EmployeeActions empleado={empleado} onDeleteClick={handleOpenModal} />
                        </div>
                        
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-auto">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-sm text-gray-500 dark:text-gray-400">Cargo:</span>
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getGroupColorClasses(empleado.grupo)}`}>
                                    {empleado.grupo || '-'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500 dark:text-gray-400">Estado:</span>
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColorClasses(empleado.estado)}`}>
                                    {empleado.estado}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            {currentItems.length === 0 && (
                <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <Users size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">No se encontraron empleados</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Intenta ajustar los filtros o el término de búsqueda.</p>
                </div>
            )}

            {/* --- Paginación --- */}
            {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 dark:border-gray-700 px-4 py-3 sm:px-6 mt-6">
                    <div className="w-full sm:w-auto text-center sm:text-left mb-2 sm:mb-0">
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                            Mostrando <span className="font-medium">{indexOfFirstItem + 1}</span> a <span className="font-medium">{Math.min(indexOfLastItem, filteredEmpleados.length)}</span> de <span className="font-medium">{filteredEmpleados.length}</span> resultados
                        </p>
                    </div>
                    <div className="w-full sm:w-auto">
                        <nav className="relative z-0 inline-flex justify-center sm:justify-end w-full rounded-md shadow-sm -space-x-px">
                            <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50">
                                <ChevronLeft size={20} />
                            </button>
                            <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-200">
                                Página {currentPage} de {totalPages}
                            </span>
                            <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50">
                                <ChevronRight size={20} />
                            </button>
                        </nav>
                    </div>
                </div>
            )}

            <ConfirmDeleteModal 
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onConfirm={handleConfirmDelete}
                employeeName={selectedEmployee ? `${selectedEmployee.nombre} ${selectedEmployee.apellido}` : ''}
                title="Confirmar Inactivación"
                message="¿Estás seguro de que quieres cambiar el estado de {employeeName} a 'Inactivo'? Esta acción se puede revertir editando el perfil del empleado."
                confirmText="Sí, inactivar"
            />
        </div>
    );
};

export default Empleados;
