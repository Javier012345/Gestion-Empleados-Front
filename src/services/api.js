import axios from 'axios';

// Función para obtener el valor de una cookie por su nombre
const getCookie = (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
};

const API_URL = 'http://localhost:8000/api/';

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use(
    (config) => {
        // Adjunta el token de autenticación si existe
        const token = getCookie('token');
        if (token) {
            config.headers['Authorization'] = `Token ${token}`;
        }
        // Adjunta el token CSRF para las peticiones que no son seguras (POST, PUT, etc.)
        if (!['GET', 'HEAD', 'OPTIONS', 'TRACE'].includes(config.method.toUpperCase())) {
            const csrftoken = getCookie('csrftoken');
            config.headers['X-CSRFToken'] = csrftoken;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para manejar respuestas con errores (como token expirado)
apiClient.interceptors.response.use(
    // Si la respuesta es exitosa, simplemente la retornamos
    (response) => response,
    // Si hay un error en la respuesta
    (error) => {
        // Verificamos si el error es por token inválido o expirado (status 401)
        if (error.response && error.response.status === 401) {
            console.log("Token expirado o inválido. Cerrando sesión.");

            // 1. Eliminar la cookie del token
            document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            
            // 2. Eliminar los datos del usuario del localStorage
            localStorage.removeItem('user');

            // 3. Redirigir al login
            window.location.href = '/login';
        }
        // Para cualquier otro error, simplemente lo rechazamos para que sea manejado por el `catch` de la llamada original
        return Promise.reject(error);
    }
);

export const getEmpleadosBasico = () => {
    return apiClient.get('empleados-basico/');
};

export const getEmpleados = () => {
    return apiClient.get('empleados/');
};

export const getEmpleadoPerfil = () => {
    return apiClient.get('/empleados/perfil/');
};


export const getEmpleadoById = (id) => {
    return apiClient.get(`empleados/${id}/`);
};

export const createEmpleado = (empleadoData) => {
    return apiClient.post('empleados/', empleadoData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const updateEmpleado = (id, empleadoData) => {
    return apiClient.put(`empleados/${id}/`, empleadoData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const deleteEmpleado = (id) => {
    return apiClient.delete(`empleados/${id}/`);
};

export const getRecibosByDni = (dni) => {
    return apiClient.get(`recibos/por-dni/${dni}/`);
};

export const getEmpleadoByDni = (dni) => {
    return apiClient.get(`empleados/por-dni/${dni}/`);
};

export const createRecibo = (reciboData) => {
    return apiClient.post('recibos/', reciboData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const updateRecibo = (id, reciboData) => {
    return apiClient.patch(`recibos/${id}/`, reciboData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const createHorario = (horarioData) => {
    return apiClient.post('horarios/', horarioData);
};

export const getHorarios = () => {
    return apiClient.get('horarios/');
};

export const sincronizarEmpleadosHorario = (horarioId, empleadoIds) => {
    const data = {
        empleado_ids: empleadoIds
    };
    return apiClient.post(`horarios/${horarioId}/sincronizar-empleados/`, data);
};

export const getHistorialAsignacionesDetallado = () => {
    return apiClient.get('historial-asignaciones/');
};

export const getIncidentesAgrupados = () => {
    return apiClient.get('incidentes-agrupados/');
};

export const getIncidenteAgrupadoPorId = (id) => {
    return apiClient.get(`incidentes-agrupados/${id}/`);
};

export const getIncidenteEmpleadoPorId = (id) => {
    return apiClient.get(`incidente-empleado/${id}/`);
};

export const getTiposIncidente = () => {
    return apiClient.get('incidentes/');
};

export const createIncidenteEmpleado = (incidenteData) => {
    return apiClient.post('incidente-empleado/', incidenteData);
};

export const corregirIncidente = (id, incidenteData) => {
    return apiClient.post(`incidentes-agrupados/${id}/corregir/`, incidenteData);
};

export const createResolucion = (resolucionData) => {
    return apiClient.post('resoluciones/', resolucionData);
};

export const getTiposSancion = () => {
    return apiClient.get('sanciones/');
};

export const aplicarSancionEmpleado = (sancionData) => {
    return apiClient.post('sanciones-empleados/', sancionData);
};

export const getSancionesEmpleados = () => {
    return apiClient.get('sanciones-empleados/');
};

export const getSancionById = (id) => {
    return apiClient.get(`sanciones-empleados/${id}/`);
};

export const getMisRecibos = () => {
    return apiClient.get('mis-recibos/');
};

export const getMisHorarios = () => {
    return apiClient.get('mis-horarios/');
};

export const getMisSanciones = () => {
    return apiClient.get('mis-sanciones/');
};

export const getMisIncidentes = () => {
    return apiClient.get('mis-incidentes/');
};

export const getMisAsistencias = () => {
    return apiClient.get('mis-asistencias/');
};

export const getMisNotificaciones = () => {
    return apiClient.get('mis-notificaciones/');
};

export const marcarNotificacionesLeidas = () => {
    return apiClient.post('notificaciones/marcar-todas-leidas/');
};

/**
 * Obtiene la lista de empleados que aún no tienen un rostro registrado.
 * @returns {Promise} La promesa de la petición de Axios.
 */
export const getEmpleadosSinRostro = () => {
    return apiClient.get('empleados-sin-rostro/');
};

/**
 * Registra el rostro de un empleado.
 * @param {number} empleadoId - El ID del empleado.
 * @param {string} image - La imagen en formato base64.
 * @returns {Promise} La promesa de la petición de Axios.
 */
export const registrarRostro = (empleadoId, image) => {
    const payload = { empleado_id: empleadoId, image: image };
    return apiClient.post('rostro/', payload);
};

/**
 * Obtiene la lista de empleados que ya tienen un rostro registrado.
 * @returns {Promise} La promesa de la petición de Axios.
 */
export const getEmpleadosConRostro = () => {
    return apiClient.get('empleados-con-rostro/');
};

/**
 * Modifica el rostro de un empleado existente.
 * @param {number} empleadoId - El ID del empleado.
 * @param {string} image - La nueva imagen en formato base64.
 * @returns {Promise} La promesa de la petición de Axios.
 */
export const modificarRostro = (empleadoId, image) => {
    const payload = { empleado_id: empleadoId, image: image };
    return apiClient.put('rostro/', payload);
};

/**
 * Marca la asistencia de un empleado mediante reconocimiento facial.
 * @param {string} image - La imagen en formato base64.
 * @returns {Promise} La promesa de la petición de Axios.
 */
export const marcarAsistencia = (image) => {
    // Limpiamos la imagen para asegurar la compatibilidad con el backend de Django.
    // 1. Quitamos el prefijo "data:image/jpeg;base64,"
    let base64Image = image.split(',')[1];

    // 2. Aseguramos que el padding sea correcto para el decodificador de Python.
    if (base64Image.length % 4 !== 0) {
        base64Image += '='.repeat(4 - base64Image.length % 4);
    }
    const payload = { image: base64Image };
    return apiClient.post('marcar/', payload);
};

// --- Dashboard ---
export const getDashboardData = () => {
    return apiClient.get('dashboard-data/');
};

export const getResumenDiario = () => {
    return apiClient.get('resumen-diario/');
};

/**
 * Obtiene el historial de asistencias para un empleado específico.
 * @param {number} empleadoId - El ID del empleado.
 * @returns {Promise} La promesa de la petición de Axios.
 */
export const getAsistenciasByEmpleadoId = (empleadoId, page = 1) => {
    return apiClient.get(`asistencias-empleado/${empleadoId}/`, { params: { page } });
};


export const changePassword = (passwordData) => {
    return apiClient.post('change-password/', passwordData);
};

export default apiClient;
