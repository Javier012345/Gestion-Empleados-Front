import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import AsistenciaFilterForm from './AsistenciaFilterForm';

const VerAsistenciasEmpleado = () => {
  const { dni } = useParams(); // Assuming DNI is passed as a URL parameter
  const [empleado, setEmpleado] = useState(null);
  const [asistencias, setAsistencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({ month: '', year: '' });

  const fetchAsistencias = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/api/ver-asistencias/${dni}/?page=${currentPage}&month=${filters.month}&year=${filters.year}`
      );
      setEmpleado(response.data.empleado);
      setAsistencias(response.data.asistencias);
      setPagination(response.data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar las asistencias.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAsistencias();
  }, [dni, currentPage, filters]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page on filter change
  };

  if (loading) return <p>Cargando asistencias...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!empleado) return <p>Empleado no encontrado.</p>;

  return (
    <div>
      <h2>Asistencias de {empleado.nombre} {empleado.apellido}</h2>
      <AsistenciaFilterForm onFilterChange={handleFilterChange} />

      {asistencias.length === 0 ? (
        <p>No hay asistencias registradas para este empleado con los filtros seleccionados.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Fecha y Hora</th>
              <th>Minutos de Retraso</th>
            </tr>
          </thead>
          <tbody>
            {asistencias.map((asistencia, index) => (
              <tr key={index}>
                <td>{new Date(asistencia.fecha_hora).toLocaleString()}</td>
                <td>{asistencia.minutos_retraso}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="pagination">
        {pagination.has_previous && (
          <button onClick={() => setCurrentPage(pagination.previous_page_number)}>
            Anterior
          </button>
        )}
        <span> Página {pagination.number} de {pagination.num_pages} </span>
        {pagination.has_next && (
          <button onClick={() => setCurrentPage(pagination.next_page_number)}>
            Siguiente
          </button>
        )}
      </div>
    </div>
  );
};

export default VerAsistenciasEmpleado;
