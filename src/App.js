import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/usuarios/Login';
import Empleados from './pages/empleados/Empleados';
import CrearEmpleado from './pages/empleados/CrearEmpleado';
import Home from './pages/home/Home'; 
import AppLayout from './components/AppLayout';
import VerEmpleado from './pages/empleados/VerEmpleado';
import EditarEmpleado from './pages/empleados/EditarEmpleado';
import PerfilEmpleado from './pages/empleados/PerfilEmpleado';
import Recibos from './pages/recibos/Recibos';
import MisRecibos from './pages/recibos/MisRecibos';
import VerRecibosEmpleado from './pages/recibos/VerRecibosEmpleado';
import Horarios from './pages/horarios/Horarios';
import AsignarHorario from './pages/horarios/AsignarHorario';
import CargarHorario from './pages/horarios/CargarHorario';
import HistorialHorarios from './pages/horarios/HistorialHorarios';
import MisHorarios from './pages/horarios/MisHorarios';
import VerHorariosAsignados from './pages/horarios/VerHorariosAsignados';
import VerHorariosEmpleado from './pages/horarios/VerHorariosEmpleado';
import Sanciones from './pages/sanciones/Sanciones';
import AgregarSancion from './pages/sanciones/AgregarSancion';
import AplicarSancionMasiva from './pages/sanciones/AplicarSancionMasiva';
import DetalleSancion from './pages/sanciones/DetalleSancion';
import MisSanciones from './pages/sanciones/MisSanciones';
import SancionPDF from './pages/sanciones/SancionPDF';
import SancionesEmpleado from './pages/sanciones/SancionesEmpleado';
import Incidentes from './pages/incidentes/Incidentes';
import CorregirIncidente from './pages/incidentes/CorregirIncidente';
import DetalleIncidente from './pages/incidentes/DetalleIncidente';
import IncidentePDF from './pages/incidentes/IncidentePDF';
import MisIncidentes from './pages/incidentes/MisIncidentes';
import RegistrarIncidente from './pages/incidentes/RegistrarIncidente';
import VerIncidentesEmpleado from './pages/incidentes/VerIncidentesEmpleado';
import AsistenciaAdmin from './pages/asistencia/AsistenciaAdmin';
import MisAsistencias from './pages/asistencia/MisAsistencias';
import VerAsistencias from './pages/asistencia/VerAsistencias';
import ReportesHome from './pages/reportes/ReportesHome';
import PrivateRoute from './components/route/PrivateRoute';
import { ThemeProvider } from './context/ThemeContext';
import './App.css';

const RouteWithTitle = ({ title, element }) => {
  return (
    <AppLayout pageTitle={title}>
      {element}
    </AppLayout>
  );
};

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<RouteWithTitle title="Inicio" element={<Home />} />} />
            <Route path="/perfil" element={<RouteWithTitle title="Mi Perfil" element={<PerfilEmpleado />} />} />
            <Route path="/empleados" element={<RouteWithTitle title="Empleados" element={<Empleados />} />} />
            <Route path="/empleados/crear" element={<RouteWithTitle title="Crear Empleado" element={<CrearEmpleado />} />} />
            <Route path="/empleados/:id" element={<RouteWithTitle title="Ver Empleado" element={<VerEmpleado />} />} />
            <Route path="/empleados/editar/:id" element={<RouteWithTitle title="Editar Empleado" element={<EditarEmpleado />} />} />
            <Route path="/recibos" element={<RouteWithTitle title="Recibos" element={<Recibos />} />} />
            <Route path="/mis-recibos" element={<RouteWithTitle title="Mis Recibos" element={<MisRecibos />} />} />
            <Route path="/recibos/empleado/:id" element={<RouteWithTitle title="Recibos de Empleado" element={<VerRecibosEmpleado />} />} />
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