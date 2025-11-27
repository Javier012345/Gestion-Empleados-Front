
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import DetalleIncidente from './DetalleIncidente';

// Mock the api module
jest.mock('../../services/api', () => ({
  getIncidenteAgrupadoPorId: jest.fn(),
  getIncidenteEmpleadoPorId: jest.fn(),
  createResolucion: jest.fn(),
  createDescargo: jest.fn(),
}));

const mockIncidente = {
  data: {
    grupo_incidente: 'INC-123',
    incidente: { tipo_incid: 'Tardanza' },
    fecha_ocurrencia: '2023-10-27T10:00:00Z',
    descripcion: 'Llegada tarde a la oficina.',
    empleados_involucrados: [{ nombre: 'Juan', apellido: 'Perez', dni: '12345678' }],
    estado: 'ABIERTO',
    resolucion: null,
    descargos_del_grupo: [],
  },
};

describe('DetalleIncidente', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    require('../../services/api').getIncidenteEmpleadoPorId.mockResolvedValue({ data: { grupo_incidente: 'INC-123' } });
    require('../../services/api').getIncidenteAgrupadoPorId.mockResolvedValue(mockIncidente);
  });

  it('should not show "Corregir" and "Registrar Resolución" buttons on "mis-incidentes" route', async () => {
    render(
      <MemoryRouter initialEntries={['/mis-incidentes/1']}>
        <Routes>
          <Route path="/mis-incidentes/:id" element={<DetalleIncidente />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for the component to finish loading data
    await screen.findByText('Detalle del Incidente');

    // Assert that the buttons are not present
    expect(screen.queryByText('Corregir')).not.toBeInTheDocument();
    expect(screen.queryByText('Registrar Resolución')).not.toBeInTheDocument();
  });

  it('should show "Corregir" and "Registrar Resolución" buttons on other routes', async () => {
    render(
      <MemoryRouter initialEntries={['/incidentes/1']}>
        <Routes>
          <Route path="/incidentes/:id" element={<DetalleIncidente />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for the component to finish loading data
    await screen.findByText('Detalle del Incidente');

    // Assert that the buttons are present
    expect(screen.getByText('Corregir')).toBeInTheDocument();
    expect(screen.getByText('Registrar Resolución')).toBeInTheDocument();
  });
});
