import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './componentes/Login';
import Empleados from './componentes/Empleados';
import CrearEmpleado from './componentes/CrearEmpleado';
import Home from './componentes/Home';
import Layout from './componentes/Layout';
import VerEmpleado from './componentes/VerEmpleado';
import EditarEmpleado from './componentes/EditarEmpleado';
import Recibos from './componentes/Recibos'; // Importar Recibos
import MisRecibos from './componentes/MisRecibos'; // Importar MisRecibos
import Horarios from './componentes/horarios/Horarios';
import AsignarHorario from './componentes/horarios/AsignarHorario';
import CargarHorario from './componentes/horarios/CargarHorario';
import HistorialHorarios from './componentes/horarios/HistorialHorarios';
import MisHorarios from './componentes/horarios/MisHorarios';
import VerHorariosAsignados from './componentes/horarios/VerHorariosAsignados';
import VerHorariosEmpleado from './componentes/horarios/VerHorariosEmpleado';
import Sanciones from './componentes/sanciones/Sanciones';
import AgregarSancion from './componentes/sanciones/AgregarSancion';
import AplicarSancionMasiva from './componentes/sanciones/AplicarSancionMasiva';
import DetalleSancion from './componentes/sanciones/DetalleSancion';
import MisSanciones from './componentes/sanciones/MisSanciones';
import SancionPDF from './componentes/sanciones/SancionPDF';
import SancionesEmpleado from './componentes/sanciones/SancionesEmpleado';
import Incidentes from './componentes/incidentes/Incidentes';
import CorregirIncidente from './componentes/incidentes/CorregirIncidente';
import DetalleIncidente from './componentes/incidentes/DetalleIncidente';
import IncidentePDF from './componentes/incidentes/IncidentePDF';
import MisIncidentes from './componentes/incidentes/MisIncidentes';
import RegistrarIncidente from './componentes/incidentes/RegistrarIncidente';
import VerIncidentesEmpleado from './componentes/incidentes/VerIncidentesEmpleado';
import AsistenciaAdmin from './componentes/asistencia/AsistenciaAdmin';
import MisAsistencias from './componentes/asistencia/MisAsistencias';
import VerAsistencias from './componentes/asistencia/VerAsistencias';
import ReportesHome from './componentes/reportes/ReportesHome';
import './App.css';

// Un componente para las rutas que requieren autenticación y layout
const AuthenticatedLayout = () => (
  <Layout pageTitle="Inicio"> {/* El pageTitle podría ser dinámico en el futuro */}
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/empleados" element={<Empleados />} />
      <Route path="/empleados/crear" element={<CrearEmpleado />} />
      <Route path="/empleados/:id" element={<VerEmpleado />} />
      <Route path="/empleados/editar/:id" element={<EditarEmpleado />} />
      <Route path="/recibos" element={<Recibos />} /> {/* Nueva ruta para Recibos */}
      <Route path="/mis-recibos" element={<MisRecibos />} /> {/* Nueva ruta para Mis Recibos */}
      <Route path="/horarios" element={<Horarios />} />
      <Route path="/horarios/asignar" element={<AsignarHorario />} />
      <Route path="/horarios/cargar" element={<CargarHorario />} />
      <Route path="/horarios/historial" element={<HistorialHorarios />} />
      <Route path="/horarios/mis-horarios" element={<MisHorarios />} />
      <Route path="/horarios/ver-asignados" element={<VerHorariosAsignados />} />
      <Route path="/horarios/ver-empleado" element={<VerHorariosEmpleado />} />
      <Route path="/sanciones" element={<Sanciones />} />
      <Route path="/sanciones/agregar" element={<AgregarSancion />} />
      <Route path="/sanciones/aplicar-masiva" element={<AplicarSancionMasiva />} />
      <Route path="/sanciones/:id" element={<DetalleSancion />} />
      <Route path="/mis-sanciones" element={<MisSanciones />} />
      <Route path="/sanciones/pdf/:id" element={<SancionPDF />} />
      <Route path="/sanciones/empleado/:id" element={<SancionesEmpleado />} />
      <Route path="/incidentes" element={<Incidentes />} />
      <Route path="/incidentes/corregir/:id" element={<CorregirIncidente />} />
      <Route path="/incidentes/:id" element={<DetalleIncidente />} />
      <Route path="/incidentes/pdf/:id" element={<IncidentePDF />} />
      <Route path="/mis-incidentes" element={<MisIncidentes />} />
      <Route path="/incidentes/registrar" element={<RegistrarIncidente />} />
      <Route path="/incidentes/empleado/:id" element={<VerIncidentesEmpleado />} />
      <Route path="/asistencia/*" element={<AsistenciaAdmin />} />
      <Route path="/mis-asistencias" element={<MisAsistencias />} />
      <Route path="/asistencia/empleado/:id" element={<VerAsistencias />} />
      <Route path="/reportes" element={<ReportesHome />} />
      {/* Añade aquí el resto de tus rutas autenticadas */}
    </Routes>
  </Layout>
);

function App() {
  const isAuthenticated = true; 

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        {isAuthenticated ? (
          <Route path="/*" element={<AuthenticatedLayout />} />
        ) : (
          <Route path="/*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;