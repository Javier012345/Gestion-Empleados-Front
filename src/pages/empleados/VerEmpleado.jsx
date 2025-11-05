import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Printer, UserCog, CalendarCheck, ShieldAlert, Clock, Receipt, FileAlert } from 'lucide-react';

// --- Mock Data ---
// En una aplicación real, usarías el `id` para fetchear datos de la API.
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
        fecha_nacimiento: '15/08/1990',
        genero: 'Femenino',
        estado_civil: 'Soltera',
        user: { groups: [{ name: 'Admin' }] },
        legajo: {
            documentos: [
                { id: 1, nombre: 'DNI FRENTE', subido: '2023-10-01 10:00', url: '#' },
                { id: 2, nombre: 'DNI DORSO', subido: '2023-10-01 10:01', url: null },
            ]
        }
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
        fecha_nacimiento: '20/04/1985',
        genero: 'Masculino',
        estado_civil: 'Casado',
        user: { groups: [{ name: 'Empleado' }] },
        legajo: null
    },
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

    const statusColor = empleado.estado === 'Activo'
        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';

    const groupColor = empleado.user.groups[0] ? getGroupColorClasses(empleado.user.groups[0].name) : '';

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <Link to="/empleados" className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500">
                    <ArrowLeft size={16} /> Volver a Empleados
                </Link>
                <a href="#" target="_blank" className="bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-700 text-sm">
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
                            className="h-32 w-32 rounded-full mx-auto mb-4 object-cover ring-4 ring-white dark:ring-gray-800 shadow-lg"
                        />
                        <h2 className="text-2xl font-bold">{empleado.nombre} {empleado.apellido}</h2>
                        {empleado.user.groups[0] && 
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
                            {/* Otros links de gestión... */}
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
                            <div><strong className="block text-gray-500">Fecha de Nac.:</strong> {empleado.fecha_nacimiento}</div>
                            <div><strong className="block text-gray-500">Género:</strong> {empleado.genero}</div>
                            <div><strong className="block text-gray-500">Estado Civil:</strong> {empleado.estado_civil}</div>
                        </div>
                    </div>

                    {empleado.legajo && (
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                            <h3 className="text-lg font-semibold border-b pb-3 dark:border-gray-700">Documentación del Legajo</h3>
                            <ul className="divide-y dark:divide-gray-700 mt-4">
                                {empleado.legajo.documentos.map(doc => (
                                    <li key={doc.id} className="flex items-center justify-between py-3">
                                        <div>
                                            <p className="text-sm font-medium">{doc.nombre}</p>
                                            <p className="text-xs text-gray-500">Subido: {new Date(doc.subido).toLocaleString()}</p>
                                        </div>
                                        <div>
                                            {doc.url ? (
                                                <a href={doc.url} target="_blank" rel="noreferrer" className="text-xs font-semibold text-blue-600 bg-blue-100 dark:text-blue-200 dark:bg-blue-900 px-3 py-1.5 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800">Ver Archivo</a>
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
