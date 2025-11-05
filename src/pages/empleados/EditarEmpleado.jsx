import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

// --- Mock Data ---
const mockEmpleados = [
    { id: 1, nombre: 'Ana', apellido: 'García', dni: '12345678', fecha_nacimiento: '15/08/1990', genero: 'Femenino', estado_civil: 'Soltera', grupo: 'Admin', estado: 'Activo', telefono: '600112233', email: 'ana.garcia@example.com', ruta_foto: 'https://i.pravatar.cc/150?u=ana' },
    { id: 2, nombre: 'Luis', apellido: 'Martinez', dni: '87654321', fecha_nacimiento: '20/04/1985', genero: 'Masculino', estado_civil: 'Casado', grupo: 'Empleado', estado: 'Inactivo', telefono: '655443322', email: 'luis.martinez@example.com', ruta_foto: null },
];

const Step = ({ number, active, completed }) => {
    let statusClass = 'text-gray-500 dark:text-gray-400';
    if (active) statusClass = 'step-active';
    if (completed) statusClass = 'step-completed';

    return (
        <li className={`flex w-full items-center text-sm font-medium ${statusClass} after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:inline-block dark:after:border-gray-700`}>
            <span className="flex items-center justify-center w-8 h-8 rounded-full shrink-0">{number}</span>
        </li>
    );
};

const EditarEmpleado = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [empleado, setEmpleado] = useState(null);

    useEffect(() => {
        const data = mockEmpleados.find(e => e.id === parseInt(id));
        setEmpleado(data);
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEmpleado(prev => ({ ...prev, [name]: value }));
    };

    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4));
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

    const handleSubmit = (e) => {
        e.preventDefault();
        // Lógica para enviar los datos a la API
        console.log('Guardando cambios:', empleado);
        alert('Empleado actualizado (simulado)');
        navigate(`/empleados/${id}`);
    };

    if (!empleado) return <div>Cargando...</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <Link to={`/empleados/${id}`} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500 mb-6">
                <ArrowLeft size={16} /> Volver al Perfil
            </Link>
            <form onSubmit={handleSubmit} noValidate>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                    <h2 className="text-2xl font-bold text-center mb-8">Editar Empleado</h2>
                    
                    {/* Stepper */}
                    <ol className="flex items-center w-full mb-8">
                        {[1, 2, 3].map(n => <Step key={n} number={n} active={currentStep === n} completed={currentStep > n} />)}
                        <li className={`flex items-center text-sm font-medium ${currentStep === 4 ? 'step-active' : 'text-gray-500'}`}><span className="flex items-center justify-center w-8 h-8 rounded-full shrink-0">4</span></li>
                    </ol>

                    {/* Contenido de los Pasos */}
                    <div className={currentStep === 1 ? '' : 'hidden'}>
                        <h3 class="text-lg font-semibold mb-4">1. Datos Personales</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           {/* Campos del paso 1 */}
                           <div>
                                <label className="block text-sm font-medium">Nombre</label>
                                <input type="text" name="nombre" value={empleado.nombre} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                           </div>
                           <div>
                                <label className="block text-sm font-medium">Apellido</label>
                                <input type="text" name="apellido" value={empleado.apellido} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                           </div>
                           {/* ... otros campos ... */}
                        </div>
                    </div>

                    <div className={currentStep === 2 ? '' : 'hidden'}>
                        <h3 class="text-lg font-semibold mb-4">2. Datos de Contacto</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium">Email</label>
                                <input type="email" name="email" value={empleado.email} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                           </div>
                           <div>
                                <label className="block text-sm font-medium">Teléfono</label>
                                <input type="tel" name="telefono" value={empleado.telefono} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                           </div>
                        </div>
                    </div>

                    <div className={currentStep === 3 ? '' : 'hidden'}>
                        <h3 class="text-lg font-semibold mb-4">3. Foto del Empleado</h3>
                        {/* ... campo de foto ... */}
                    </div>

                    <div className={currentStep === 4 ? '' : 'hidden'}>
                        <h3 class="text-lg font-semibold mb-4">4. Documentación</h3>
                        {/* ... campos de documentación ... */}
                    </div>

                    {/* Botones de Navegación */}
                    <div className="mt-8 pt-4 border-t dark:border-gray-700 flex justify-between items-center">
                        <button type="button" onClick={prevStep} disabled={currentStep === 1} className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50">
                            Anterior
                        </button>
                        <div>
                            <Link to={`/empleados/${id}`} className="px-4 py-2 mr-2">Cancelar</Link>
                            {currentStep < 4 ? (
                                <button type="button" onClick={nextStep} className="px-6 py-2 bg-red-600 text-white rounded-lg">
                                    Siguiente
                                </button>
                            ) : (
                                <button type="submit" className="px-6 py-2 bg-red-600 text-white rounded-lg">
                                    Guardar Cambios
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default EditarEmpleado;
