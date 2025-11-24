import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAsistenciasByEmpleadoId, getEmpleadoById } from '../../services/api';
import { Loader, AlertCircle, CalendarDays, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';

const VerAsistenciasEmpleado = () => {
  const { id } = useParams();
  const [empleado, setEmpleado] = useState(null);
  const [asistencias, setAsistencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({ month: '', year: '' });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Obtener datos del empleado y asistencias en paralelo
        const [empleadoRes, asistenciasRes] = await Promise.all([
          getEmpleadoById(id),
          getAsistenciasByEmpleadoId(id, currentPage, filters)
        ]);
        
        setEmpleado(empleadoRes.data);
        setAsistencias(asistenciasRes.data.results || []);
        setPagination(asistenciasRes.data.pagination);

      } catch (err) {
        setError(err.response?.data?.message || 'Error al cargar los datos del empleado y sus asistencias.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, currentPage, filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handlePageChange = (newPage) => {
    if (pagination && newPage >= 1 && newPage <= pagination.num_pages) {
        setCurrentPage(newPage);
    }
  };

  if (loading) return <div className="flex justify-center items-center p-10"><Loader className="animate-spin text-red-600" size={48} /></div>;
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;
  if (!empleado) return <div className="p-6 text-center">Empleado no encontrado.</div>;

  return (
    <div className="max-w-7xl mx-auto">
      <Link to={`/empleados/${id}`} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500 mb-4">
          <ArrowLeft size={16} /> Volver al Perfil del Empleado
      </Link>
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Asistencias de {empleado.nombre} {empleado.apellido}</h2>
      
      {/* Aquí podrías poner un formulario de filtros si lo necesitas */}

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
        {asistencias.length === 0 ? (
          <div className="text-center py-12">
              <div className="mx-auto h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
                  <CalendarDays className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">No se encontraron asistencias</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Este empleado no tiene asistencias registradas.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                  <th className="p-4 text-left">Fecha</th>
                  <th className="p-4 text-left">Hora de Entrada</th>
                  <th className="p-4 text-left">Minutos de Retraso</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {asistencias.map((asistencia) => (
                  <tr key={asistencia.id} className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="p-4 text-gray-800 dark:text-gray-300">{new Date(asistencia.fecha_hora).toLocaleDateString('es-AR', { timeZone: 'UTC' })}</td>
                    <td className="p-4 font-semibold text-gray-900 dark:text-gray-100">{new Date(asistencia.fecha_hora).toLocaleTimeString('es-AR', { timeZone: 'UTC' })}</td>
                    <td className="p-4 font-semibold">
                      {asistencia.minutos_retraso > 5 ? (
                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-full dark:bg-red-900 dark:text-red-300">
                              {asistencia.minutos_retraso} min - Tarde
                          </span>
                      ) : asistencia.minutos_retraso > 0 ? (
                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-yellow-700 bg-yellow-100 rounded-full dark:bg-yellow-900 dark:text-yellow-300">
                              {asistencia.minutos_retraso} min - A tiempo
                          </span>
                      ) : (
                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full dark:bg-green-900 dark:text-green-300">
                              En horario
                          </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {pagination && pagination.num_pages > 1 && (
          <div className="flex items-center justify-between mt-4">
              <button onClick={() => handlePageChange(currentPage - 1)} disabled={!pagination.has_previous} className="flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-600">
                  <ChevronLeft size={16} className="mr-2" /> Anterior
              </button>
              <span className="text-sm text-gray-700 dark:text-gray-400">
                  Página {pagination.number} de {pagination.num_pages}
              </span>
              <button onClick={() => handlePageChange(currentPage + 1)} disabled={!pagination.has_next} className="flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-600">
                  Siguiente <ChevronRight size={16} className="ml-2" />
              </button>
          </div>
      )}
    </div>
  );
};

export default VerAsistenciasEmpleado;
