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
import DetalleSancion from './pages/sanciones/DetalleSancion';
import MisSanciones from './pages/sanciones/MisSanciones';
import SancionesEmpleado from './pages/sanciones/SancionesEmpleado';
import Incidentes from './pages/incidentes/Incidentes';
import CorregirIncidente from './pages/incidentes/CorregirIncidente';
import DetalleIncidente from './pages/incidentes/DetalleIncidente';
import MisIncidentes from './pages/incidentes/MisIncidentes';
import RegistrarIncidente from './pages/incidentes/RegistrarIncidente';
import VerIncidentesEmpleado from './pages/incidentes/VerIncidentesEmpleado';
import AsistenciaAdmin from './pages/asistencia/AsistenciaAdmin';
import MisAsistencias from './pages/asistencia/MisAsistencias';
import VerAsistenciasEmpleado from './pages/asistencia/VerAsistenciasEmpleado';
import Notificaciones from './pages/notificaciones/Notificaciones';
import ReportesHome from './pages/reportes/ReportesHome';
import Ajustes from './pages/usuarios/Ajustes';
import PrivateRoute from './components/route/PrivateRoute';
import ProtectedRoleRoute from './components/route/ProtectedRoleRoute';
import { ThemeProvider } from './context/ThemeContext';
import './App.css';
import ConfirmPasswordReset from './pages/usuarios/ConfirmPasswordReset';
import ResetPassword from './pages/usuarios/ResetPassword';
import { AuthProvider } from './components/layout/AuthContext';

const RouteWithTitle = ({ title, element }) => {
  return (
    <AppLayout pageTitle={title}>
      {element}
    </AppLayout>
  );
};

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/cambiar-contrasena" element={<Ajustes forceChange={true} />} />
            <Route path="/restablecer-contrasena" element={<ResetPassword />} />
            <Route path="/nueva-contrasena" element={<ConfirmPasswordReset />} />

            {/* Rutas para todos los roles autenticados */}
            <Route element={<PrivateRoute />}>
              <Route path="/perfil" element={<RouteWithTitle title="Mi Perfil" element={<PerfilEmpleado />} />} />
              <Route path="/ajustes" element={<RouteWithTitle title="Ajustes" element={<Ajustes />} />} />
              <Route path="/notificaciones" element={<RouteWithTitle title="Notificaciones" element={<Notificaciones />} />} />
            </Route>

            {/* Rutas solo para el modo Empleado */}
            <Route element={<ProtectedRoleRoute allowedRoles={['employee']} />}>
              <Route path="/mis-recibos" element={<RouteWithTitle title="Mis Recibos" element={<MisRecibos />} />} />
              <Route path="/mis-horarios" element={<RouteWithTitle title="Mis Horarios" element={<MisHorarios />} />} />
              <Route path="/mis-incidentes" element={<RouteWithTitle title="Mis Incidentes" element={<MisIncidentes />} />} />
              <Route path="/mis-sanciones" element={<RouteWithTitle title="Mis Sanciones" element={<MisSanciones />} />} />
              <Route path="/mis-asistencias" element={<RouteWithTitle title="Mis Asistencias" element={<MisAsistencias />} />} />
            </Route>

            {/* Rutas solo para el modo Admin */}
            <Route element={<ProtectedRoleRoute allowedRoles={['admin']} />}>
              <Route path="/" element={<RouteWithTitle title="Inicio" element={<Home />} />} />
              <Route path="/empleados" element={<RouteWithTitle title="Empleados" element={<Empleados />} />} />
              <Route path="/empleados/crear" element={<RouteWithTitle title="Crear Empleado" element={<CrearEmpleado />} />} />
              <Route path="/empleados/:id" element={<RouteWithTitle title="Ver Empleado" element={<VerEmpleado />} />} />
              <Route path="/empleados/editar/:id" element={<RouteWithTitle title="Editar Empleado" element={<EditarEmpleado />} />} />
              <Route path="/recibos" element={<RouteWithTitle title="Recibos" element={<Recibos />} />} />
              <Route path="/recibos/empleado/:id" element={<RouteWithTitle title="Recibos de Empleado" element={<VerRecibosEmpleado />} />} />
              <Route path="/horarios" element={<RouteWithTitle title="Horarios" element={<Horarios />} />} />
              <Route path="/horarios/asignar" element={<RouteWithTitle title="Asignar Horario" element={<AsignarHorario />} />} />
              <Route path="/horarios/cargar" element={<RouteWithTitle title="Cargar Horario" element={<CargarHorario />} />} />
              <Route path="/horarios/historial" element={<RouteWithTitle title="Historial de Horarios" element={<HistorialHorarios />} />} />
              <Route path="/horarios/empleado/:id" element={<RouteWithTitle title="Horarios del Empleado" element={<VerHorariosEmpleado />} />} />
              <Route path="/sanciones" element={<RouteWithTitle title="Sanciones" element={<Sanciones />} />} />
              <Route path="/sanciones/:id" element={<RouteWithTitle title="Detalle Sancion" element={<DetalleSancion />} />} />
              <Route path="/sanciones/agregar" element={<RouteWithTitle title="Agregar Sanción" element={<AgregarSancion />} />} />
              <Route path="/sanciones/empleado/:id" element={<RouteWithTitle title="Sanciones de Empleado" element={<SancionesEmpleado />} />} />
              <Route path="/incidentes" element={<RouteWithTitle title="Incidentes" element={<Incidentes />} />} />
              <Route path="/incidentes/:id" element={<RouteWithTitle title="Detalle Incidente" element={<DetalleIncidente />} />} />
              <Route path="/incidentes/corregir/:id" element={<RouteWithTitle title="Corregir Incidente" element={<CorregirIncidente />} />} />
              <Route path="/incidentes/registrar" element={<RouteWithTitle title="Registrar Incidente" element={<RegistrarIncidente />} />} />
              <Route path="/incidentes/empleado/:id" element={<RouteWithTitle title="Incidentes de Empleado" element={<VerIncidentesEmpleado />} />} />
              <Route path="/asistencias/empleado/:id" element={<RouteWithTitle title="Asistencias de Empleado" element={<VerAsistenciasEmpleado />} />} />
              <Route path="/asistencia/*" element={<RouteWithTitle title="Asistencia" element={<AsistenciaAdmin />} />} />
              <Route path="/reportes" element={<RouteWithTitle title="Reportes" element={<ReportesHome />} />} />
            </Route>

          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;