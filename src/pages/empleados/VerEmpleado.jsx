import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Printer, UserCog, CalendarCheck, ShieldAlert, Clock, Receipt, FileWarning } from 'lucide-react';

// --- Mock Data ---
const mockEmpleados = [
    {
        id: 1,
        nombre: 'Ana',
        apellido: 'García',
        dni: '12345678A',
        email: 'ana.garcia@example.com',
        ruta_foto: 'https://i.pravatar.cc/150?u=ana',
        estado: 'Activo',
        telefono: '600112233',
        fecha_nacimiento: '1990-08-15',
        genero: 'Femenino',
        estado_civil: 'Soltera',
        user: { groups: [{ name: 'Admin' }] },
        legajo_id: 1, // Simulate legajo existence
    },
    {
        id: 2,
        nombre: 'Luis',
        apellido: 'Martinez',
        dni: '87654321B',
        email: 'luis.martinez@example.com',
        ruta_foto: null,
        estado: 'Inactivo',
        telefono: '655443322',
        fecha_nacimiento: '1985-04-20',
        genero: 'Masculino',
        estado_civil: 'Casado',
        user: { groups: [{ name: 'Empleado' }] },
        legajo_id: null,
    },
];

const mockLegajos = [
    {
        id: 1,
        empleado_id: 1,
        documentos: [
            { id: 1, id_requisito: { nombre_doc: 'DNI FRENTE' }, fecha_hora_subida: '2023-10-01T10:00:00Z', ruta_archivo: '#' },
            { id: 2, id_requisito: { nombre_doc: 'DNI DORSO' }, fecha_hora_subida: '2023-10-01T10:01:00Z', ruta_archivo: null },
        ]
    }
];

const getGroupColorClasses = (groupName) => {
    switch (groupName) {
        case 'Admin': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
        case 'Gerente': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
        default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
};

const VerEmpleado = () => {
    const { id } = useParams();
    const empleado = mockEmpleados.find(e => e.id === parseInt(id));

    if (!empleado) {
        return <div className="p-6 text-center">Empleado no encontrado.</div>;
    }

    const legajo = mockLegajos.find(l => l.empleado_id === empleado.id);
    const documentos = legajo ? legajo.documentos : [];

    const statusColor = empleado.estado === 'Activo'
        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';

    const groupColor = empleado.user?.groups[0] ? getGroupColorClasses(empleado.user.groups[0].name) : '';

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
                        <h2 className="text-2xl font-bold">{empleado.nombre} {empleado.apellido}</h2>
                        {empleado.user?.groups[0] && 
                            <span className={`mt-2 inline-block px-3 py-1 text-sm font-semibold rounded-full ${groupColor}`}>
                                {empleado.user.groups[0].name}
                            </span>
                        }
                        <span className={`mt-2 inline-block px-3 py-1 text-sm font-semibold rounded-full ${statusColor}`}>{empleado.estado}</span>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                        <h3 className="text-lg font-semibold border-b pb-3 dark:border-gray-700">Gestión del Empleado</h3>
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
                        <h3 className="text-lg font-semibold border-b pb-3 dark:border-gray-700">Datos Personales</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-sm">
                            <div><strong className="block text-gray-500">DNI:</strong> {empleado.dni}</div>
                            <div><strong className="block text-gray-500">Email:</strong> {empleado.email}</div>
                            <div><strong className="block text-gray-500">Teléfono:</strong> {empleado.telefono || '-'}</div>
                            <div><strong className="block text-gray-500">Fecha de Nac.:</strong> {new Date(empleado.fecha_nacimiento).toLocaleDateString()}</div>
                            <div><strong className="block text-gray-500">Género:</strong> {empleado.genero}</div>
                            <div><strong className="block text-gray-500">Estado Civil:</strong> {empleado.estado_civil}</div>
                        </div>
                    </div>

                    {legajo && (
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                            <h3 className="text-lg font-semibold border-b pb-3 dark:border-gray-700">Documentación del Legajo</h3>
                            <ul className="divide-y dark:divide-gray-700 mt-4">
                                {documentos.map(doc => (
                                    <li key={doc.id} className="flex items-center justify-between py-3">
                                        <div>
                                            <p className="text-sm font-medium">{doc.id_requisito.nombre_doc}</p>
                                            <p className="text-xs text-gray-500">Subido: {new Date(doc.fecha_hora_subida).toLocaleString()}</p>
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

