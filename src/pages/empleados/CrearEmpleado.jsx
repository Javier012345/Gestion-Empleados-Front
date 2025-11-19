import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createEmpleado } from '../../services/api';
import AlertDialog from '../../components/layout/AlertDialog';
import { UserPlus, AlertTriangle } from 'lucide-react';

// --- Validation logic ---
const validationRules = {
    nombre: {
        regex: /^[a-zA-Z\s\u00C0-\u017F]+$/,
        message: 'Solo se permiten letras, acentos y espacios.',
        required: true,
    },
    apellido: {
        regex: /^[a-zA-Z\s\u00C0-\u017F]+$/,
        message: 'Solo se permiten letras, acentos y espacios.',
        required: true,
    },
    dni: {
        regex: /^\d{7,8}$/,
        message: 'El DNI debe contener entre 7 y 8 dígitos numéricos.',
        required: true,
    },
    telefono: {
        regex: /^\d{10}$/,
        message: 'El teléfono debe contener 10 dígitos.',
        required: true,
    },
    email: {
        regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'El formato del email no es válido.',
        required: true,
    },
    fecha_nacimiento: { required: true },
    genero: { required: true },
    estado_civil: { required: true },
    grupo_input: { required: true },
};

const validateField = (name, value) => {
    const rule = validationRules[name];
    if (!rule) return '';

    if (rule.required && !value) {
        return 'Este campo es obligatorio.';
    }

    if (rule.regex && value && !rule.regex.test(value)) {
        return rule.message;
    }

    return '';
};


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
const FormField = ({ label, name, type = 'text', value, onChange, onBlur, error, children, accept }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
        {children ? (
            React.cloneElement(children, { 
                id: name, 
                name: name, 
                value: value, 
                onChange: onChange, 
                onBlur: onBlur,
                className: `mt-1 block w-full rounded-md border-2 border-gray-400 bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm ${error ? 'border-red-500' : 'focus:border-red-500 focus:ring-red-500'}`
            })
        ) : (
            <input 
                type={type} 
                id={name} 
                name={name} 
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                accept={accept}
                className={
                    `${type === 'file' 
                    ? 'mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100 dark:file:bg-gray-700 dark:file:text-gray-300 dark:hover:file:bg-gray-600'
                    : `mt-1 block w-full rounded-md border-2 border-gray-400 bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'focus:border-indigo-500 focus:ring-indigo-500'}`}`
                }
            />
        )}
        {/* El mensaje de error de texto se ha eliminado según la solicitud */}
    </div>
);

const CrearEmpleado = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [isConfirmOpen, setConfirmOpen] = useState(false);
    const [isSuccessOpen, setSuccessOpen] = useState(false);
    const [isCancelConfirmOpen, setCancelConfirmOpen] = useState(false);
    const [formData, setFormData] = useState({
        nombre: '', 
        apellido: '', 
        dni: '', 
        fecha_nacimiento: '', 
        genero: '', 
        estado_civil: '', 
        grupo_input: '', 
        estado: 'Activo',
        telefono: '', 
        email: '',
        fecha_ingreso: new Date().toISOString().split('T')[0],
        ruta_foto: null,
        documentos: {},
    });
    const [errors, setErrors] = useState({});

    const [grupos, setGrupos] = useState([]);
    const [requisitos, setRequisitos] = useState([]);
    useEffect(() => {
        setGrupos([ { id: 1, name: 'Administrador' }, { id: 2, name: 'Empleado' } ]);
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

        // --- Lógica de filtrado de entrada ---
        if (name === 'nombre' || name === 'apellido') {
            // Solo permite letras, acentos y espacios.
            if (!/^[a-zA-Z\s\u00C0-\u017F]*$/.test(value)) return;
        }
        if (name === 'dni') {
            // Solo permite números y hasta 8 dígitos.
            if (!/^[0-9]*$/.test(value) || value.length > 8) return;
        }
        if (name === 'telefono') {
            // Solo permite números y hasta 10 dígitos.
            if (!/^[0-9]*$/.test(value) || value.length > 10) return;
        }

        setFormData(prev => ({ ...prev, [name]: value }));

        // Si hay un error para este campo, lo limpia para que el borde rojo desaparezca mientras se escribe.
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };
    
    const handleBlur = (e) => {
        const { name, value } = e.target;
        const error = validateField(name, value);
        // Actualiza el estado de error solo para el campo que perdió el foco.
        setErrors(prev => ({ ...prev, [name]: error }));
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

    const handleFinalSubmit = () => {
        setConfirmOpen(true);
    };

    const handleSubmit = async () => {
        setConfirmOpen(false);
        // Validación completa del formulario antes de enviarlo.
        const formErrors = {};
        let firstErrorStep = null;

        Object.keys(validationRules).forEach(fieldName => {
            const error = validateField(fieldName, formData[fieldName]);
            if (error) {
                formErrors[fieldName] = error;
                if (!firstErrorStep) {
                    if (['nombre', 'apellido', 'dni', 'fecha_nacimiento', 'genero', 'estado_civil', 'grupo_input'].includes(fieldName)) {
                        firstErrorStep = 1;
                    } else if (['telefono', 'email'].includes(fieldName)) {
                        firstErrorStep = 2;
                    }
                }
            }
        });

        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            // Si se encuentra un error, navega al primer paso que contiene un error.
            if (firstErrorStep) {
                setCurrentStep(firstErrorStep);
            }
            return; // Detiene el envío del formulario.
        }

        const postData = new FormData();

        Object.keys(formData).forEach(key => {
            if (key === 'documentos') {
                Object.keys(formData.documentos).forEach(docKey => {
                    postData.append(docKey, formData.documentos[docKey]);
                });
            } else if (formData[key] !== null) {
                postData.append(key, formData[key]);
            }
        });

        try {
            await createEmpleado(postData);
            setSuccessOpen(true);
        } catch (error) {
            console.error('Error al crear el empleado:', error.response?.data || error.message);
            if (error.response && error.response.data) {
                // Mapea los errores del backend al estado de errores del frontend.
                const backendErrors = error.response.data;
                const newErrors = { ...errors };
                for (const key in backendErrors) {
                    newErrors[key] = backendErrors[key][0]; // Toma el primer mensaje de error.
                }
                setErrors(newErrors);
            }
            alert('Error al crear el empleado. Revisa los campos marcados en rojo.');
        }
    };

    return (
        <div className="p-4 sm:p-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm max-w-4xl mx-auto">
                <Stepper currentStep={currentStep} />

                {currentStep === 1 && (
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">1. Datos Personales</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField label="Nombre" name="nombre" value={formData.nombre} onChange={handleChange} onBlur={handleBlur} error={errors.nombre} />
                            <FormField label="Apellido" name="apellido" value={formData.apellido} onChange={handleChange} onBlur={handleBlur} error={errors.apellido} />
                            <FormField label="DNI" name="dni" type="text" value={formData.dni} onChange={handleChange} onBlur={handleBlur} error={errors.dni} />
                            <FormField label="Fecha de Nacimiento" name="fecha_nacimiento" type="date" value={formData.fecha_nacimiento} onChange={handleChange} onBlur={handleBlur} error={errors.fecha_nacimiento} />
                            <FormField label="Género" name="genero" value={formData.genero} onChange={handleChange} onBlur={handleBlur} error={errors.genero}>
                                <select>
                                    <option value="">Seleccionar...</option>
                                    <option value="F">Femenino</option>
                                    <option value="M">Masculino</option>
                                    <option value="O">Otro</option>
                                </select>
                            </FormField>
                            <FormField label="Estado Civil" name="estado_civil" value={formData.estado_civil} onChange={handleChange} onBlur={handleBlur} error={errors.estado_civil}>
                                <select>
                                    <option value="">Seleccionar...</option>
                                    <option value="Soltero">Soltero/a</option>
                                    <option value="Casado">Casado/a</option>
                                    <option value="Divorciado">Divorciado/a</option>
                                    <option value="Viudo">Viudo/a</option>
                                </select>
                            </FormField>
                            <FormField label="Cargo" name="grupo_input" value={formData.grupo_input} onChange={handleChange} onBlur={handleBlur} error={errors.grupo_input}><select><option value="">Seleccionar Cargo...</option>{grupos.map(g => <option key={g.name} value={g.name}>{g.name}</option>)}</select></FormField>
                            <FormField label="Estado" name="estado" value={formData.estado} onChange={handleChange} onBlur={handleBlur} error={errors.estado}><select><option value="Activo">Activo</option><option value="Inactivo">Inactivo</option></select></FormField>
                        </div>
                    </div>
                )}

                {currentStep === 2 && (
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">2. Datos de Contacto</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField label="Teléfono" name="telefono" type="tel" value={formData.telefono} onChange={handleChange} onBlur={handleBlur} error={errors.telefono} />
                            <FormField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} onBlur={handleBlur} error={errors.email} />
                        </div>
                    </div>
                )}

                {currentStep === 3 && (
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">3. Foto del Empleado</h3>
                        <FormField label="Foto de perfil" name="ruta_foto" type="file" onChange={handleFileChange} error={errors.ruta_foto} accept="image/*" />
                        {formData.ruta_foto && <img src={URL.createObjectURL(formData.ruta_foto)} alt="Preview" className="mt-4 h-32 w-32 rounded-full object-cover"/>}
                    </div>
                )}

                {currentStep === 4 && (
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">4. Documentación Requerida</h3>
                        <div className="space-y-3">
                            {requisitos.map(req => (
                                <div key={req.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{req.nombre_doc} {req.obligatorio && <span className="text-red-500">*</span>}</p>
                                    <input type="file" name={`documento_${req.id}`} onChange={handleFileChange} className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 dark:file:bg-red-900/50 dark:file:text-red-300 dark:hover:file:bg-red-900"/>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="mt-8 pt-4 border-t dark:border-gray-700 flex justify-between items-center">
                    <button type="button" onClick={handlePrev} disabled={currentStep === 1} className="px-4 py-2 bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 disabled:opacity-50">Anterior</button>
                    <div>
                        <button type="button" onClick={() => setCancelConfirmOpen(true)} className="px-4 py-2 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 mr-2">Cancelar</button>
                        
                        <button type="button" onClick={handleNext} className={`px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 ${currentStep === 4 ? 'hidden' : ''}`}>
                            Siguiente
                        </button>
                        <button type="button" onClick={handleFinalSubmit} className={`px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 ${currentStep === 4 ? '' : 'hidden'}`}>
                            Finalizar
                        </button>
                    </div>
                </div>
            </div>
            <AlertDialog
                isOpen={isConfirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={handleSubmit}
                title="Confirmar Registro"
                message="¿Estás seguro de que quieres registrar a este empleado?"
                confirmText="Aceptar"
                cancelText="Cancelar"
                icon={UserPlus}
            />
            <AlertDialog
                isOpen={isSuccessOpen}
                onClose={() => navigate('/empleados')}
                onConfirm={() => navigate('/empleados')}
                title="Empleado Creado"
                message="El empleado ha sido creado exitosamente."
                confirmText="Aceptar"
                cancelText="Aceptar"
                icon={UserPlus}
                iconColor="green"
                confirmButton={{
                    className: "bg-green-600 hover:bg-green-700",
                }}
            />
            <AlertDialog
                isOpen={isCancelConfirmOpen}
                onClose={() => setCancelConfirmOpen(false)}
                onConfirm={() => navigate('/empleados')}
                title="Confirmar Cancelación"
                message="Si cancelas, se perderán todos los datos ingresados. ¿Estás seguro?"
                confirmText="Sí, cancelar"
                cancelText="No, continuar"
                icon={AlertTriangle}
            />
        </div>
    );
};

export default CrearEmpleado;
