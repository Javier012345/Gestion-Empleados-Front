import React, { useState, useEffect } from 'react';

const AsistenciaFilterForm = ({ onFilterChange, initialMonth, initialYear }) => {
  const [month, setMonth] = useState(initialMonth || '');
  const [year, setYear] = useState(initialYear || '');

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i); // Last 5 years

  useEffect(() => {
    onFilterChange({ month, year });
  }, [month, year]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleMonthChange = (e) => {
    setMonth(e.target.value);
  };

  const handleYearChange = (e) => {
    setYear(e.target.value);
  };

  return (
    <div className="asistencia-filter-form">
      <label htmlFor="month-select">Mes:</label>
      <select id="month-select" value={month} onChange={handleMonthChange}>
        <option value="">Todos</option>
        <option value="1">Enero</option>
        <option value="2">Febrero</option>
        <option value="3">Marzo</option>
        <option value="4">Abril</option>
        <option value="5">Mayo</option>
        <option value="6">Junio</option>
        <option value="7">Julio</option>
        <option value="8">Agosto</option>
        <option value="9">Septiembre</option>
        <option value="10">Octubre</option>
        <option value="11">Noviembre</option>
        <option value="12">Diciembre</option>
      </select>

      <label htmlFor="year-select" style={{ marginLeft: '10px' }}>Año:</label>
      <select id="year-select" value={year} onChange={handleYearChange}>
        <option value="">Todos</option>
        {years.map(y => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>
    </div>
  );
};

export default AsistenciaFilterForm;
