import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Printer, Plus, Eye, Edit2, Trash2, MoreHorizontal, ChevronLeft, ChevronRight, Users } from 'lucide-react';
import ConfirmDeleteModal from '../../components/modals/ConfirmDeleteModal';

// --- Mock Data ---
const mockEmpleados = Array.from({ length: 25 }, (_, i) => ({
    id: i + 1,
    nombre: `Empleado ${i + 1}`,
    apellido: `Apellido ${i + 1}`,
    dni: `${Math.floor(10000000 + Math.random() * 90000000)}A`,
    email: `empleado.${i + 1}@example.com`,
    ruta_foto: `https://i.pravatar.cc/150?u=empleado${i+1}`,
    estado: i % 3 === 0 ? 'Inactivo' : 'Activo',
    user: { groups: [{ name: i % 2 === 0 ? 'Admin' : 'Empleado' }] }
}));

const mockCargos = [
    { id: 'Admin', name: 'Admin' },
    { id: 'Empleado', name: 'Empleado' },
];

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
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto flex-grow">
                <div className="relative w-full sm:max-w-xs group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 transition-colors group-hover:text-red-500" />
                    <input 
                        type="text" 
                        placeholder="Buscar por nombre o DNI..." 
                        value={searchTerm}
                        onChange={onSearchChange}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200"
                    />
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <select 
                        value={estadoFilter}
                        onChange={onEstadoChange}
                        className="py-2.5 px-4 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500 cursor-pointer transition-all duration-200 hover:border-red-500/50">
                        <option value="">Todos los Estados</option>
                        {estado_choices.map(([value, display]) => <option key={value} value={value}>{display}</option>)}
                    </select>
                    <select 
                        value={cargoFilter}
                        onChange={onCargoChange}
                        className="py-2.5 px-4 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500 cursor-pointer transition-all duration-200 hover:border-red-500/50">
                        <option value="">Todos los Cargos</option>
                        {cargos.map(cargo => <option key={cargo.id} value={cargo.name}>{cargo.name}</option>)}
                    </select>
                </div>
            </div>
            <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-3">
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
const EmployeeActions = ({ empleado, onDeleteClick }) => {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className="relative" onMouseLeave={() => setMenuOpen(false)}>
            <button onMouseEnter={() => setMenuOpen(true)} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                <MoreHorizontal className="text-gray-500 dark:text-gray-400" />
            </button>
            {menuOpen && (
                <div className="absolute top-full right-0 w-48 bg-white dark:bg-gray-900 rounded-md shadow-lg z-50 border dark:border-gray-700 py-1">
                    <Link to={`/empleados/${empleado.id}`} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
                        <Eye size={16} />Ver Perfil
                    </Link>
                    <Link to={`/empleados/editar/${empleado.id}`} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
                        <Edit2 size={16} />Editar
                    </Link>
                    <button onClick={() => onDeleteClick(empleado)} className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/50 w-full text-left">
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

    // Estado para el modal de eliminación
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    // Estado para la paginación
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    useEffect(() => {
        setEmpleados(mockEmpleados);
        setCargos(mockCargos);
    }, []);

    const handleOpenModal = (empleado) => {
        setSelectedEmployee(empleado);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedEmployee(null);
    };

    const handleConfirmDelete = () => {
        console.log('Eliminando empleado:', selectedEmployee.id);
        setEmpleados(empleados.filter(e => e.id !== selectedEmployee.id));
        handleCloseModal();
    };

    const filteredEmpleados = empleados.filter(empleado => {
        const fullName = `${empleado.nombre} ${empleado.apellido}`.toLowerCase();
        const dni = empleado.dni.toLowerCase();
        const search = searchTerm.toLowerCase();
        const groupName = empleado.user.groups[0]?.name;

        return (
            (fullName.includes(search) || dni.includes(search)) &&
            (estadoFilter === '' || empleado.estado === estadoFilter) &&
            (cargoFilter === '' || groupName === cargoFilter)
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
        return groupName === 'Admin' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800';
    };

    const getStatusColorClasses = (status) => {
        return status === 'Activo' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
    };

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

            {/* --- Lista de Empleados --- */}
            {currentItems.length > 0 ? (
                <div className="hidden md:block overflow-hidden bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-700/50">
                            <tr className="text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
                                <th className="px-6 py-4">Foto</th>
                                <th className="px-6 py-4">Nombre</th>
                                <th className="px-6 py-4">DNI</th>
                                <th className="px-6 py-4">Email</th>
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
                                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{empleado.dni}</td>
                                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{empleado.email}</td>
                                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                                        {empleado.user.groups.length > 0 ? (
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getGroupColorClasses(empleado.user.groups[0].name)}`}>
                                                {empleado.user.groups[0].name}
                                            </span>
                                        ) : '-'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColorClasses(empleado.estado)}`}>
                                            {empleado.estado}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <EmployeeActions empleado={empleado} onDeleteClick={handleOpenModal} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg"><p>No se encontraron empleados que coincidan con la búsqueda.</p></div>
            )}

            {/* --- Paginación --- */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 px-4 py-3 sm:px-6 mt-6">
                    <div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                            Mostrando <span className="font-medium">{indexOfFirstItem + 1}</span> a <span className="font-medium">{Math.min(indexOfLastItem, filteredEmpleados.length)}</span> de <span className="font-medium">{filteredEmpleados.length}</span> resultados
                        </p>
                    </div>
                    <div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                            <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50">
                                <ChevronLeft size={20} />
                            </button>
                            <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                                Página {currentPage} de {totalPages}
                            </span>
                            <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50">
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
            />
        </div>
    );
};

export default Empleados;
