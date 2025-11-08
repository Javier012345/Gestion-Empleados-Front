import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Componente para el indicador de pasos (Stepper)
const Stepper = ({ currentStep }) => {
    const steps = ['Datos Personales', 'Contacto', 'Foto', 'Documentación'];

    return (
        <ol className="flex items-center w-full mb-8">
            {steps.map((step, index) => {
                const stepNumber = index + 1;
                const isActive = currentStep === stepNumber;
                const isCompleted = currentStep > stepNumber;

                return (
                    <li key={stepNumber} className={`flex w-full items-center text-sm font-medium ${isCompleted ? 'text-red-600 dark:text-red-500' : 'text-gray-500 dark:text-gray-400'} ${index < steps.length -1 ? "after:content-[''] after:w-full after:h-1 after:border-b after:border-1 after:inline-block dark:after:border-gray-700" : ""} ${isCompleted ? 'after:border-red-600' : 'after:border-gray-200'}`}>
                        <span className={`flex items-center justify-center w-8 h-8 rounded-full shrink-0 ${isActive || isCompleted ? 'bg-red-100 dark:bg-red-800' : 'bg-gray-100 dark:bg-gray-700'}`}>
                            {stepNumber}
                        </span>
                    </li>
                );
            })}
        </ol>
    );
};

// Componente para un campo de formulario genérico
const FormField = ({ label, name, type = 'text', value, onChange, error, children, accept }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
        {children ? (
            React.cloneElement(children, { 
                id: name, 
                name: name, 
                value: value, 
                onChange: onChange, 
                className: 'mt-1 block w-full rounded-md border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-700 shadow-sm'
            })
        ) : (
            <input 
                type={type} 
                id={name} 
                name={name} 
                value={value}
                onChange={onChange}
                accept={accept}
                className={
                    type === 'file' 
                    ? 'mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100 dark:file:bg-gray-700 dark:file:text-gray-300 dark:hover:file:bg-gray-600'
                    : 'mt-1 block w-full rounded-md border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-700 shadow-sm'
                }
            />
        )}
        {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
    </div>
);

const CrearEmpleado = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        nombre: '', apellido: '', dni: '', fecha_nacimiento: '', genero: '', estado_civil: '', grupo: '', estado: 'Activo',
        telefono: '', email: '',
        ruta_foto: null,
        documentos: {},
    });
    const [errors, setErrors] = useState({});

    const [grupos, setGrupos] = useState([]);
    const [requisitos, setRequisitos] = useState([]);
    useEffect(() => {
        setGrupos([ { id: 1, name: 'Admin' }, { id: 2, name: 'Empleado' } ]);
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

    const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, 4));
    const handlePrev = () => setCurrentStep(prev => Math.max(prev - 1, 1));

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (name === 'ruta_foto') {
            setFormData(prev => ({ ...prev, ruta_foto: files[0] }));
        } else {
            setFormData(prev => ({ 
                ...prev, 
                documentos: { ...prev.documentos, [name]: files[0] }
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Enviando formulario:', formData);
        alert('Empleado creado (simulación). Mira la consola para ver los datos.');
        navigate('/empleados');
    };

    return (
        <div className="p-4 sm:p-6">
            <form onSubmit={handleSubmit} noValidate encType="multipart/form-data">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm max-w-4xl mx-auto">
                    <Stepper currentStep={currentStep} />

                    {currentStep === 1 && (
                        <div>
                            <h3 className="text-lg font-semibold mb-4">1. Datos Personales</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField label="Nombre" name="nombre" value={formData.nombre} onChange={handleChange} error={errors.nombre} />
                                <FormField label="Apellido" name="apellido" value={formData.apellido} onChange={handleChange} error={errors.apellido} />
                                <FormField label="DNI" name="dni" type="number" value={formData.dni} onChange={handleChange} error={errors.dni} />
                                <FormField label="Fecha de Nacimiento" name="fecha_nacimiento" type="date" value={formData.fecha_nacimiento} onChange={handleChange} error={errors.fecha_nacimiento} />
                                <FormField label="Género" name="genero" value={formData.genero} onChange={handleChange} error={errors.genero}><select><option value="">Seleccionar...</option><option value="Masculino">Masculino</option><option value="Femenino">Femenino</option></select></FormField>
                                <FormField label="Estado Civil" name="estado_civil" value={formData.estado_civil} onChange={handleChange} error={errors.estado_civil}><select><option value="">Seleccionar...</option><option value="Soltero/a">Soltero/a</option><option value="Casado/a">Casado/a</option></select></FormField>
                                <FormField label="Cargo" name="grupo" value={formData.grupo} onChange={handleChange} error={errors.grupo}><select><option value="">Seleccionar Cargo...</option>{grupos.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}</select></FormField>
                                <FormField label="Estado" name="estado" value={formData.estado} onChange={handleChange} error={errors.estado}><select><option value="Activo">Activo</option><option value="Inactivo">Inactivo</option></select></FormField>
                            </div>
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div>
                            <h3 className="text-lg font-semibold mb-4">2. Datos de Contacto</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField label="Teléfono" name="telefono" type="tel" value={formData.telefono} onChange={handleChange} error={errors.telefono} />
                                <FormField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} error={errors.email} />
                            </div>
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div>
                            <h3 className="text-lg font-semibold mb-4">3. Foto del Empleado</h3>
                            <FormField label="Foto de perfil" name="ruta_foto" type="file" onChange={handleFileChange} error={errors.ruta_foto} accept="image/*" />
                            {formData.ruta_foto && <img src={URL.createObjectURL(formData.ruta_foto)} alt="Preview" className="mt-4 h-32 w-32 rounded-full object-cover"/>}
                        </div>
                    )}

                    {currentStep === 4 && (
                        <div>
                            <h3 className="text-lg font-semibold mb-4">4. Documentación Requerida</h3>
                            <div className="space-y-3">
                                {requisitos.map(req => (
                                    <div key={req.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                        <p className="text-sm font-medium">{req.nombre_doc} {req.obligatorio && <span className="text-red-500">*</span>}</p>
                                        <input type="file" name={`doc_${req.id}`} onChange={handleFileChange} className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 dark:file:bg-red-900/50 dark:file:text-red-300 dark:hover:file:bg-red-900"/>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="mt-8 pt-4 border-t dark:border-gray-700 flex justify-between items-center">
                        <button type="button" onClick={handlePrev} disabled={currentStep === 1} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 disabled:opacity-50">Anterior</button>
                        <div>
                            <button type="button" onClick={() => navigate('/empleados')} className="px-4 py-2 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 mr-2">Cancelar</button>
                            
                            {/* Lógica de botones corregida */}
                            <button type="button" onClick={handleNext} className={`px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 ${currentStep === 4 ? 'hidden' : ''}`}>
                                Siguiente
                            </button>
                            <button type="submit" className={`px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 ${currentStep === 4 ? '' : 'hidden'}`}>
                                Finalizar
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CrearEmpleado;
