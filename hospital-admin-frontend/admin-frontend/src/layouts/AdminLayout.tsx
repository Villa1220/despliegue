// src/layouts/AdminLayout.tsx
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/admin/Sidebar';
import Navbar from '../components/admin/Navbar';
import { Box } from '@mui/material';

// Define routes accessible by role
const roleBasedRoutes: { [key: string]: string[] } = {
  admin: [
    '/admin',
    '/admin/employees',
    '/admin/specialties',
    '/admin/appointments',
    '/admin/medical-centers',
    '/admin/doctors',
    '/admin/reports',
  ],
  doctor: [
    '/admin/specialties',
    '/admin/appointments',
    '/admin/medical-centers',
  ],
};

export default function AdminLayout() {
  const { user } = useAuth();
  const location = useLocation();

  // Redirige al login si no hay usuario autenticado
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Verifica si el usuario tiene acceso a la ruta actual
  const allowedRoutes = roleBasedRoutes[user.role] || [];
  const currentPath = location.pathname;
  if (!allowedRoutes.includes(currentPath)) {
    // Redirige a la primera ruta permitida para el rol
    return <Navigate to={allowedRoutes[0] || '/login'} replace />;
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box component="main" sx={{ 
        flexGrow: 1,
        p: 3,
        marginTop: '64px', // Ajuste para el Navbar fijo
        width: 'calc(100% - 250px)' // Ajuste para el Sidebar
      }}>
        <Navbar />
        <Outlet /> {/* Renderiza las rutas hijas */}
      </Box>
    </Box>
  );
}
