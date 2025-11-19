import React from 'react';
import { Printer } from 'lucide-react';

// Mock data - en una aplicación real, esto vendría de una API
const empleado = {
    id: 1,
    nombre: 'Maxi',
    apellido: 'K',
    ruta_foto: null, // O una URL a una imagen: '/path/to/photo.jpg'
    get_iniciales: 'MK',
    estado: 'Activo',
    dni: '12.345.678',
    email: 'maxi.k@ejemplo.com',
    telefono: '11-2233-4455',
    fecha_nacimiento: '1990-05-15',
    get_genero_display: 'Masculino',
    get_estado_civil_display: 'Soltero/a',
};

const documentos_status = [
    { nombre: 'DNI (frente)', entregado: false, url: null },
    { nombre: 'DNI (dorso)', entregado: false, url: null },
    { nombre: 'Constancia de CUIL', entregado: false, url: null },
    { nombre: 'Alta en AFIP (Formulario 931)', entregado: false, url: null },
    { nombre: 'Contrato de trabajo (firmado)', entregado: false, url: null },
    { nombre: 'Examen preocupacional/Certificado de aptitud laboral', entregado: false, url: null },
    { nombre: 'Certificado de antecedentes penales', entregado: false, url: null },
    { nombre: 'Constancia de inscripción en la ART', entregado: false, url: null },
    { nombre: 'Afiliación a obra social', entregado: false, url: null },
    { nombre: 'Declaración jurada de cargas de familia', entregado: false, url: null },
    { nombre: 'Copia de la libreta de asignaciones familiares', entregado: false, url: null },
    { nombre: 'Títulos académicos o certificados de estudios', entregado: false, url: null },
];

const PerfilEmpleado = () => {

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString('es-AR', options);
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Mi Perfil</h1>
                <a href="#" target="_blank" className="bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-700 text-sm">
                    <Printer size={16} /> Imprimir Perfil
                </a>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Columna de la izquierda: Info básica */}
                <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm text-center">
                        {empleado.ruta_foto ? (
                            <img src={empleado.ruta_foto} className="h-32 w-32 rounded-full mx-auto mb-4 object-cover" alt="Foto de perfil" />
                        ) : (
                            <div className="h-32 w-32 rounded-full mx-auto mb-4 bg-red-600 flex items-center justify-center text-white text-5xl font-bold">
                                {empleado.get_iniciales}
                            </div>
                        )}
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{empleado.nombre} {empleado.apellido}</h2>
                        
                        <span className={`mt-4 inline-block px-3 py-1 text-sm font-semibold rounded-full 
                            ${empleado.estado === 'Activo' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'}
                        `}>
                            {empleado.estado}
                        </span>
                    </div>
                </div>

                {/* Columna de la derecha: Detalles */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                    <h3 className="text-lg font-semibold border-b pb-3 dark:border-gray-700 text-gray-900 dark:text-gray-100">Datos Personales</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-sm text-gray-700 dark:text-gray-300">
                        <div><strong className="block text-gray-500 dark:text-gray-400">DNI:</strong> {empleado.dni}</div>
                        <div><strong className="block text-gray-500 dark:text-gray-400">Email:</strong> {empleado.email}</div>
                        <div><strong className="block text-gray-500 dark:text-gray-400">Teléfono:</strong> {empleado.telefono}</div>
                        <div><strong className="block text-gray-500 dark:text-gray-400">Fecha de Nac.:</strong> {formatDate(empleado.fecha_nacimiento)}</div>
                        <div><strong className="block text-gray-500 dark:text-gray-400">Género:</strong> {empleado.get_genero_display}</div>
                        <div><strong className="block text-gray-500 dark:text-gray-400">Estado Civil:</strong> {empleado.get_estado_civil_display}</div>
                    </div>

                    <h3 className="text-lg font-semibold border-b pb-3 dark:border-gray-700 mt-8 text-gray-900 dark:text-gray-100">Documentación</h3>
                    <ul className="divide-y dark:divide-gray-700 mt-4">
                        {documentos_status.map((doc, index) => (
                            <li key={index} className="flex items-center justify-between py-3">
                                <p className="text-sm text-gray-700 dark:text-gray-300">{doc.nombre}</p>
                                {doc.entregado ? (
                                    <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-green-600 bg-green-100 dark:text-green-200 dark:bg-green-900 px-2 py-1 rounded-full hover:bg-green-200 dark:hover:bg-green-800">
                                        Ver Documento
                                    </a>
                                ) : (
                                    <span className="text-xs font-semibold text-red-600 bg-red-100 dark:text-red-200 dark:bg-red-900 px-2 py-1 rounded-full">Pendiente</span>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default PerfilEmpleado;