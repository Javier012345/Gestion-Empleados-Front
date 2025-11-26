import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getEmpleadoPerfil } from '../../services/api';
import { Loader, Printer, FileText, X } from 'lucide-react';

const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('es-AR', { timeZone: 'UTC' });
};

const PerfilEmpleado = () => {
    const [empleado, setEmpleado] = useState(null);
    const [requisitos, setRequisitos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isPhotoModalOpen, setPhotoModalOpen] = useState(false);

    useEffect(() => {
        const fetchEmpleado = async () => {
            try {
                setLoading(true);
                const response = await getEmpleadoPerfil();
                setEmpleado(response.data);
                setError(null);
            } catch (err) {
                setError('No se pudo cargar la información del perfil. Por favor, intente de nuevo más tarde.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchEmpleado();
    }, []);

    useEffect(() => {
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
    }, []);

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
        return <div className="p-6 text-center">No se encontró la información del perfil.</div>;
    }

    const documentos = empleado.legajo ? empleado.legajo.documento_set : [];

    const statusColor = empleado.estado === 'Activo'
        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';

    const getGroupColorClasses = (groupName) => {
        switch (groupName) {
            case 'Administrador': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            case 'Empleado': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
        }
    };
    const groupColor = empleado.grupo ? getGroupColorClasses(empleado.grupo) : '';

    return (
        <div className="max-w-7xl mx-auto printable-area">
            {/* Estilos para impresión */}
            <style>
                {`
                    @media print {
                        body {
                            background-color: #fff;
                        }
                        .printable-area {
                            color: #000 !important;
                        }
                        .no-print {
                            display: none !important;
                        }
                        .print-text-strong {
                            color: #000 !important;
                        }
                    }
                `}
            </style>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 no-print">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Mi Perfil</h1>
                <button 
                    onClick={() => window.print()} 
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-700 text-sm"
                >
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
                </div>

                {/* Columna Derecha */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                        <h3 className="text-lg font-semibold border-b pb-3 dark:border-gray-700 text-gray-900 dark:text-gray-100">Datos Personales</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-sm text-gray-700 dark:text-gray-300">
                            <div><strong className="block text-gray-500 dark:text-gray-400 print-text-strong">DNI:</strong> {empleado.dni}</div>
                            <div><strong className="block text-gray-500 dark:text-gray-400 print-text-strong">Email:</strong> {empleado.email}</div>
                            <div><strong className="block text-gray-500 dark:text-gray-400 print-text-strong">Teléfono:</strong> {empleado.telefono}</div>
                            <div><strong className="block text-gray-500 dark:text-gray-400 print-text-strong">Fecha de Nac.:</strong> {formatDate(empleado.fecha_nacimiento)}</div>
                            <div><strong className="block text-gray-500 dark:text-gray-400 print-text-strong">Género:</strong> {empleado.genero === 'M' ? 'Masculino' : 'Femenino'}</div>
                            <div><strong className="block text-gray-500 dark:text-gray-400 print-text-strong">Estado Civil:</strong> {empleado.estado_civil}</div>
                        </div>

                        <h3 className="text-lg font-semibold border-b pb-3 dark:border-gray-700 mt-8 text-gray-900 dark:text-gray-100">Documentación</h3>
                        <ul className="divide-y dark:divide-gray-700 mt-4">
                            {requisitos.map(requisito => {
                                const docEntregado = documentos.find(d => d.id_requisito === requisito.id);
                                const nombreArchivo = docEntregado?.ruta_archivo?.split('/').pop() || '';
                                const esValido = docEntregado && docEntregado.ruta_archivo && !nombreArchivo.startsWith('vacio_');

                                return (
                                    <li key={requisito.id} className="flex items-center justify-between py-3">
                                        <p className="text-sm text-gray-700 dark:text-gray-300">{requisito.nombre_doc}</p>
                                        {esValido ? (
                                            <a href={docEntregado.ruta_archivo} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs font-semibold text-green-600 bg-green-100 dark:text-green-200 dark:bg-green-900 px-2 py-1 rounded-full hover:bg-green-200 dark:hover:bg-green-800">
                                                <FileText size={12} /> Ver Archivo
                                            </a>
                                        ) : (
                                            <span className="text-xs font-semibold text-red-600 bg-red-100 dark:text-red-200 dark:bg-red-900 px-2 py-1 rounded-full">Pendiente</span>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
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

export default PerfilEmpleado;
