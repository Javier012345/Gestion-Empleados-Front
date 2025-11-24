import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Printer, UserCog, CalendarCheck, ShieldAlert, Clock, Receipt, FileWarning, Loader, X } from 'lucide-react';
import { getEmpleadoById } from '../../services/api';

const getGroupColorClasses = (groupName) => {
    switch (groupName) {
        case 'Administrador': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
        case 'Empleado': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
        default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
};

const VerEmpleado = () => {
    const { id } = useParams();
    const [empleado, setEmpleado] = useState(null);
    const [requisitos, setRequisitos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isPhotoModalOpen, setPhotoModalOpen] = useState(false);

    useEffect(() => {
        const fetchEmpleado = async () => {
            try {
                setLoading(true);
                const response = await getEmpleadoById(id);
                setEmpleado(response.data);
                setError(null);
            } catch (err) {
                setError('No se pudo cargar la información del empleado. Por favor, intente de nuevo más tarde.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchEmpleado();

        setRequisitos([
            { id: 1, nombre_doc: 'DNI (frente)', obligatorio: false },
            { id: 2, nombre_doc: 'DNI (dorso)', obligatorio: false },
            { id: 3, nombre_doc: 'Constancia de CUIL', obligatorio: false },
            { id: 4, nombre_doc: 'Alta en AFIP (Formulario 931)', obligatorio: false },
            { id: 5, nombre_doc: 'Contrato de trabajo (firmado)', obligatorio: false },
            { id: 6, nombre_doc: 'Examen preocupacional/Certificado de aptitud laboral', obligatorio: false },
            { id: 7, nombre_doc: 'Certificado de antecedentes penales', obligatorio: false },
            { id: 8, nombre_doc: 'Constancia de inscripción en la ART', obligatorio: false },
            { id: 9, nombre_doc: 'Afiliación a obra social', obligatorio: false },
            { id: 10, nombre_doc: 'Declaración jurada de cargas de familia', obligatorio: false },
            { id: 11, nombre_doc: 'Copia de la libreta de asignaciones familiares', obligatorio: false },
            { id: 12, nombre_doc: 'Títulos académicos o certificados de estudios', obligatorio: false },
        ]);
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center p-10">
                <Loader className="animate-spin text-red-600" size={48} data-testid="loader" />
            </div>
        );
    }

    if (error) {
        return <div className="p-6 text-center text-red-500">{error}</div>;
    }

    if (!empleado) {
        return <div className="p-6 text-center">Empleado no encontrado.</div>;
    }

    const documentos = empleado.legajo ? empleado.legajo.documento_set : [];

    const statusColor = empleado.estado === 'Activo'
        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';

    const groupColor = empleado.grupo ? getGroupColorClasses(empleado.grupo) : '';

    return (
        <div className="max-w-7xl mx-auto printable-area">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 no-print">
                <Link to="/empleados" className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500">
                    <ArrowLeft size={16} /> Volver a Empleados
                </Link>
                <button onClick={() => window.print()} className="bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-700 text-sm">
                    <Printer size={16} /> Imprimir Perfil
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Columna Izquierda */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm text-center">
                        <button
                            type="button"
                            onClick={() => empleado.ruta_foto && setPhotoModalOpen(true)}
                            disabled={!empleado.ruta_foto}
                            className="relative group disabled:cursor-default"
                        >
                            <img
                                src={empleado.ruta_foto || '/images/default-user.jpg'}
                                alt={`Foto de ${empleado.nombre}`}
                                className="h-32 w-32 rounded-full mx-auto mb-4 object-cover"
                            />
                            {empleado.ruta_foto && <div className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-40 flex items-center justify-center transition-all duration-300"><span className="text-white opacity-0 group-hover:opacity-100">Agrandar</span></div>}
                        </button>

                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{empleado.nombre} {empleado.apellido}</h2>
                        {empleado.grupo &&
                            <span className={`mt-2 inline-block px-3 py-1 text-sm font-semibold rounded-full ${groupColor}`}>
                                {empleado.grupo}
                            </span>
                        }
                        <span className={`mt-2 inline-block px-3 py-1 text-sm font-semibold rounded-full ${statusColor}`}>{empleado.estado}</span>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                        <h3 className="text-lg font-semibold border-b pb-3 dark:border-gray-700 text-gray-900 dark:text-white">Gestión del Empleado</h3>
                        <div className="mt-4 space-y-2">
                            <Link to={`/empleados/editar/${empleado.id}`} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white">
                                <span className="font-medium ">Editar Datos Personales</span>
                                <UserCog size={20} className="text-gray-500 dark:text-gray-400" />
                            </Link>
                            <Link to={`/asistencias/empleado/${empleado.id}`} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white">
                                <span className="font-medium ">Ver Asistencias</span>
                                <CalendarCheck size={20} className="text-gray-500 dark:text-gray-400" />
                            </Link>
                            <Link to={`/sanciones/empleado/${empleado.id}`} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white">
                                <span className="font-medium ">Administrar Sanciones</span>
                                <ShieldAlert size={20} className="text-gray-500 dark:text-gray-400" />
                            </Link>
                            <Link to={`/horarios/empleado/${empleado.id}`} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white">
                                <span className="font-medium ">Administrar Horarios</span>
                                <Clock size={20} className="text-gray-500 dark:text-gray-400" />
                            </Link>
                            <Link to={`/recibos/empleado/${empleado.id}`} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white">
                                <span className="font-medium ">Ver Recibos de Sueldo</span>
                                <Receipt size={20} className="text-gray-500 dark:text-gray-400" />
                            </Link>
                            <Link to={`/incidentes/empleado/${empleado.id}`} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white">
                                <span className="font-medium ">Ver Incidentes</span>
                                <FileWarning size={20} className="text-gray-500 dark:text-gray-400" />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Columna Derecha */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                        <h3 className="text-lg font-semibold border-b pb-3 dark:border-gray-700 text-gray-900 dark:text-gray-100">Datos Personales</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-sm text-gray-900 dark:text-gray-100">
                            <div><strong className="block text-gray-600 dark:text-gray-400">DNI:</strong> {empleado.dni}</div>
                            <div><strong className="block text-gray-600 dark:text-gray-400">Email:</strong> {empleado.email}</div>
                            <div><strong className="block text-gray-600 dark:text-gray-400">Teléfono:</strong> {empleado.telefono || '-'}</div>
                            <div><strong className="block text-gray-600 dark:text-gray-400">Fecha de Nac.:</strong> {new Date(empleado.fecha_nacimiento).toLocaleDateString()}</div>
                            <div><strong className="block text-gray-600 dark:text-gray-400">Género:</strong> {empleado.genero}</div>
                            <div><strong className="block text-gray-600 dark:text-gray-400">Estado Civil:</strong> {empleado.estado_civil}</div>
                        </div>
                    </div>

                    {empleado.legajo && (
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                            <h3 className="text-lg font-semibold border-b pb-3 dark:border-gray-700 text-gray-900 dark:text-gray-100">Documentación del Legajo</h3>
                            <ul className="divide-y dark:divide-gray-700 mt-4">
                                {requisitos.map(requisito => {
                                    const docEntregado = documentos.find(d => d.id_requisito === requisito.id);
                                    const nombreArchivo = docEntregado?.ruta_archivo?.split('/').pop() || '';
                                    const esValido = docEntregado && docEntregado.ruta_archivo && !nombreArchivo.startsWith('vacio_');

                                    return (
                                        <li key={requisito.id} className="flex items-center justify-between py-3">
                                            <p className="text-sm text-gray-700 dark:text-gray-300">{requisito.nombre_doc}</p>
                                            {esValido ? (
                                                <a href={docEntregado.ruta_archivo} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-green-600 bg-green-100 dark:text-green-200 dark:bg-green-900 px-2 py-1 rounded-full hover:bg-green-200 dark:hover:bg-green-800">Ver Archivo</a>
                                            ) : (
                                                <span className="text-xs font-semibold text-red-600 bg-red-100 dark:text-red-200 dark:bg-red-900 px-2 py-1 rounded-full">Pendiente</span>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal para la foto */}
            {isPhotoModalOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
                    onClick={() => setPhotoModalOpen(false)}
                >
                    <button onClick={() => setPhotoModalOpen(false)} className="absolute top-4 right-4 text-white hover:text-gray-300 z-50">
                        <X size={32} />
                    </button>
                    <img src={empleado.ruta_foto} alt="Foto de perfil ampliada" className="max-w-full max-h-full rounded-lg shadow-2xl" onClick={(e) => e.stopPropagation()} />
                </div>
            )}
        </div>
    );
};

export default VerEmpleado;