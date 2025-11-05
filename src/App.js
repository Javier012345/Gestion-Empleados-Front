import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './componentes/Login';
import Empleados from './componentes/Empleados';
import CrearEmpleado from './componentes/CrearEmpleado';
import Home from './componentes/Home';
import Layout from './componentes/Layout';
import VerEmpleado from './componentes/VerEmpleado';
import EditarEmpleado from './componentes/EditarEmpleado';
import Recibos from './componentes/Recibos';
import MisRecibos from './componentes/MisRecibos';
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
import PrivateRoute from './componentes/PrivateRoute';
import { ThemeProvider } from './context/ThemeContext';
import './App.css';

const RouteWithTitle = ({ title, element }) => {
  return (
    <Layout pageTitle={title}>
      {element}
    </Layout>
  );
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('isAuthenticated') === 'true');

  useEffect(() => {
    localStorage.setItem('isAuthenticated', isAuthenticated);
  }, [isAuthenticated]);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route element={<PrivateRoute isAuthenticated={isAuthenticated} />}>
            <Route path="/" element={<RouteWithTitle title="Inicio" element={<Home />} />} />
            <Route path="/empleados" element={<RouteWithTitle title="Empleados" element={<Empleados />} />} />
            <Route path="/empleados/crear" element={<RouteWithTitle title="Crear Empleado" element={<CrearEmpleado />} />} />
            <Route path="/empleados/:id" element={<RouteWithTitle title="Ver Empleado" element={<VerEmpleado />} />} />
            <Route path="/empleados/editar/:id" element={<RouteWithTitle title="Editar Empleado" element={<EditarEmpleado />} />} />
            <Route path="/recibos" element={<RouteWithTitle title="Recibos" element={<Recibos />} />} />
            <Route path="/mis-recibos" element={<RouteWithTitle title="Mis Recibos" element={<MisRecibos />} />} />
            <Route path="/horarios" element={<RouteWithTitle title="Horarios" element={<Horarios />} />} />
            <Route path="/horarios/asignar" element={<RouteWithTitle title="Asignar Horario" element={<AsignarHorario />} />} />
            <Route path="/horarios/cargar" element={<RouteWithTitle title="Cargar Horario" element={<CargarHorario />} />} />
            <Route path="/horarios/historial" element={<RouteWithTitle title="Historial de Horarios" element={<HistorialHorarios />} />} />
            <Route path="/horarios/mis-horarios" element={<RouteWithTitle title="Mis Horarios" element={<MisHorarios />} />} />
            <Route path="/horarios/ver-asignados" element={<RouteWithTitle title="Ver Horarios Asignados" element={<VerHorariosAsignados />} />} />
            <Route path="/horarios/ver-empleado" element={<RouteWithTitle title="Ver Horarios de Empleado" element={<VerHorariosEmpleado />} />} />
            <Route path="/sanciones" element={<RouteWithTitle title="Sanciones" element={<Sanciones />} />} />
            <Route path="/sanciones/agregar" element={<RouteWithTitle title="Agregar Sanción" element={<AgregarSancion />} />} />
            <Route path="/sanciones/aplicar-masiva" element={<RouteWithTitle title="Aplicar Sanción Masiva" element={<AplicarSancionMasiva />} />} />
            <Route path="/sanciones/:id" element={<RouteWithTitle title="Detalle de Sanción" element={<DetalleSancion />} />} />
            <Route path="/mis-sanciones" element={<RouteWithTitle title="Mis Sanciones" element={<MisSanciones />} />} />
            <Route path="/sanciones/pdf/:id" element={<RouteWithTitle title="Sanción PDF" element={<SancionPDF />} />} />
            <Route path="/sanciones/empleado/:id" element={<RouteWithTitle title="Sanciones de Empleado" element={<SancionesEmpleado />} />} />
            <Route path="/incidentes" element={<RouteWithTitle title="Incidentes" element={<Incidentes />} />} />
            <Route path="/incidentes/corregir/:id" element={<RouteWithTitle title="Corregir Incidente" element={<CorregirIncidente />} />} />
            <Route path="/incidentes/:id" element={<RouteWithTitle title="Detalle de Incidente" element={<DetalleIncidente />} />} />
            <Route path="/incidentes/pdf/:id" element={<RouteWithTitle title="Incidente PDF" element={<IncidentePDF />} />} />
            <Route path="/mis-incidentes" element={<RouteWithTitle title="Mis Incidentes" element={<MisIncidentes />} />} />
            <Route path="/incidentes/registrar" element={<RouteWithTitle title="Registrar Incidente" element={<RegistrarIncidente />} />} />
            <Route path="/incidentes/empleado/:id" element={<RouteWithTitle title="Incidentes de Empleado" element={<VerIncidentesEmpleado />} />} />
            <Route path="/asistencia/*" element={<RouteWithTitle title="Asistencia" element={<AsistenciaAdmin />} />} />
            <Route path="/mis-asistencias" element={<RouteWithTitle title="Mis Asistencias" element={<MisAsistencias />} />} />
            <Route path="/asistencia/empleado/:id" element={<RouteWithTitle title="Asistencias de Empleado" element={<VerAsistencias />} />} />
            <Route path="/reportes" element={<RouteWithTitle title="Reportes" element={<ReportesHome />} />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;