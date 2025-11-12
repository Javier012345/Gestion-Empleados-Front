import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Printer, UserCog, CalendarCheck, ShieldAlert, Clock, Receipt, FileWarning, Loader } from 'lucide-react';
import { getEmpleadoById } from '../../services/api';

const getGroupColorClasses = (groupName) => {
    switch (groupName) {
        case 'Administrador': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
        case 'Gerente': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
        default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
};

const VerEmpleado = () => {
    const { id } = useParams();
    const [empleado, setEmpleado] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
        <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <Link to="/empleados" className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500">
                    <ArrowLeft size={16} /> Volver a Empleados
                </Link>
                <a href={`/empleados/generar-perfil-pdf/${empleado.id}`} target="_blank" rel="noreferrer" className="bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-700 text-sm">
                    <Printer size={16} /> Imprimir Perfil
                </a>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Columna Izquierda */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm text-center">
                        <img 
                            src={empleado.ruta_foto || '/images/default-user.jpg'}
                            alt={`Foto de ${empleado.nombre}`}
                            className="h-32 w-32 rounded-full mx-auto mb-4 object-cover"
                        />
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{empleado.nombre} {empleado.apellido}</h2>
                        {empleado.grupo && 
                            <span className={`mt-2 inline-block px-3 py-1 text-sm font-semibold rounded-full ${groupColor}`}>
                                {empleado.grupo}
                            </span>
                        }
                        <span className={`mt-2 inline-block px-3 py-1 text-sm font-semibold rounded-full ${statusColor}`}>{empleado.estado}</span>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                        <h3 className="text-lg font-semibold border-b pb-3 dark:border-gray-700 text-gray-900 dark:text-gray-100">Gestión del Empleado</h3>
                        <div className="mt-4 space-y-2">
                            <Link to={`/empleados/editar/${empleado.id}`} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                                <span className="font-medium">Editar Datos Personales</span>
                                <UserCog size={20} className="text-gray-500" />
                            </Link>
                            <Link to={`/asistencia/empleado/${empleado.id}`} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                                <span className="font-medium">Ver Asistencias</span>
                                <CalendarCheck size={20} className="text-gray-500" />
                            </Link>
                            <Link to={`/sanciones/empleado/${empleado.id}`} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                                <span className="font-medium">Administrar Sanciones</span>
                                <ShieldAlert size={20} className="text-gray-500" />
                            </Link>
                            <Link to={`/horarios/ver-empleado/${empleado.id}`} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                                <span className="font-medium">Administrar Horarios</span>
                                <Clock size={20} className="text-gray-500" />
                            </Link>
                            <Link to={`/recibos/empleado/${empleado.id}`} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                                <span className="font-medium">Ver Recibos de Sueldo</span>
                                <Receipt size={20} className="text-gray-500" />
                            </Link>
                            <Link to={`/incidentes/empleado/${empleado.id}`} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                                <span className="font-medium">Ver Incidentes</span>
                                <FileWarning size={20} className="text-gray-500" />
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
                                {documentos.map(doc => (
                                    <li key={doc.id} className="flex items-center justify-between py-3">
                                        <div>
                                            {/* Nota: La API no devuelve el nombre del requisito, solo el ID. */}
                                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Documento Requisito ID: {doc.id_requisito}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Subido: {new Date(doc.fecha_hora_subida).toLocaleString()}</p>
                                        </div>
                                        <div>
                                            {doc.ruta_archivo ? (
                                                <a href={doc.ruta_archivo} target="_blank" rel="noreferrer" className="text-xs font-semibold text-blue-600 bg-blue-100 dark:text-blue-200 dark:bg-blue-900 px-3 py-1.5 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800">Ver Archivo</a>
                                            ) : (
                                                <span className="text-xs font-semibold text-yellow-600 bg-yellow-100 dark:text-yellow-200 dark:bg-yellow-900 px-3 py-1.5 rounded-full">Pendiente</span>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VerEmpleado;