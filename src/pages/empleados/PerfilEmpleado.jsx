import React, { useState, useEffect } from 'react';
import { Printer, Loader, AlertCircle } from 'lucide-react';
import { getEmpleadoPerfil } from '../../services/api'; // Asegúrate que la ruta es correcta

// Lista de requisitos que se podrían obtener de la API en el futuro
const REQUISITOS_LEGAJO = [
    { id: 1, nombre: 'DNI (frente)' },
    { id: 2, nombre: 'DNI (dorso)' },
    { id: 3, nombre: 'Constancia de CUIL' },
    { id: 4, nombre: 'Alta en AFIP (Formulario 931)' },
    { id: 5, nombre: 'Contrato de trabajo (firmado)' },
    { id: 6, nombre: 'Examen preocupacional/Certificado de aptitud laboral' },
    { id: 7, nombre: 'Certificado de antecedentes penales' },
    { id: 8, nombre: 'Constancia de inscripción en la ART' },
    { id: 9, nombre: 'Afiliación a obra social' },
    { id: 10, nombre: 'Declaración jurada de cargas de familia' },
    { id: 11, nombre: 'Copia de la libreta de asignaciones familiares' },
    { id: 12, nombre: 'Títulos académicos o certificados de estudios' },
];

const PerfilEmpleado = () => {
    const [empleado, setEmpleado] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPerfil = async () => {
            try {
                setLoading(true);
                const response = await getEmpleadoPerfil();
                console.log('Datos del perfil recibidos:', response.data); // Log para depuración
                setEmpleado(response.data);
                setError(null);
            } catch (err) {
                setError('No se pudo cargar la información del perfil.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchPerfil();
    }, []);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString('es-AR', options);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center p-10">
                <Loader className="animate-spin text-red-600" size={48} />
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

    if (!empleado) {
        return <div className="p-6 text-center">No se encontró información del perfil.</div>;
    }

    const getIniciales = (nombre, apellido) => {
        return `${nombre?.charAt(0) || ''}${apellido?.charAt(0) || ''}`.toUpperCase();
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
                                {getIniciales(empleado.nombre, empleado.apellido)}
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
                        <div><strong className="block text-gray-500 dark:text-gray-400">Género:</strong> {empleado.genero === 'M' ? 'Masculino' : 'Femenino'}</div>
                        <div><strong className="block text-gray-500 dark:text-gray-400">Estado Civil:</strong> {empleado.estado_civil}</div>
                    </div>

                    <h3 className="text-lg font-semibold border-b pb-3 dark:border-gray-700 mt-8 text-gray-900 dark:text-gray-100">Documentación</h3>
                    <ul className="divide-y dark:divide-gray-700 mt-4">
                        {REQUISITOS_LEGAJO.map((requisito) => {
                            const docEntregado = empleado.legajo?.documento_set.find(d => d.id_requisito === requisito.id);
                            return (
                                <li key={requisito.id} className="flex items-center justify-between py-3">
                                <p className="text-sm text-gray-700 dark:text-gray-300">{requisito.nombre}</p>
                                {docEntregado ? (
                                    <a href={docEntregado.ruta_archivo} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-green-600 bg-green-100 dark:text-green-200 dark:bg-green-900 px-2 py-1 rounded-full hover:bg-green-200 dark:hover:bg-green-800">
                                        Ver Documento
                                    </a>
                                ) : (
                                    <span className="text-xs font-semibold text-red-600 bg-red-100 dark:text-red-200 dark:bg-red-900 px-2 py-1 rounded-full">Pendiente</span>
                                )}
                            </li>
                        )})}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default PerfilEmpleado;