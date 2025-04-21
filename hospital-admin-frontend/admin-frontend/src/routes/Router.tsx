// src/routes/Router.tsx
import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import AdminLayout from '../layouts/AdminLayout'
import AuthLayout from '../layouts/AuthLayout'

const LoginPage = lazy(() => import('../pages/auth/LoginPage'))
const Dashboard = lazy(() => import('../pages/admin/Dashboard'))
const EmployeesManagement = lazy(() => import('../pages/admin/EmployeesManagement'))
const SpecialtiesManagement = lazy(() => import('../pages/admin/SpecialtiesManagement'))
const AppointmentsManagement = lazy(() => import('../pages/admin/AppointmentsManagement'))
const MedicalCentersManagement = lazy(() => import('../pages/admin/MedicalCentersManagement'))
const DoctorsManagement = lazy(() => import('../pages/admin/DoctorsManagement'))
const Reports = lazy(() => import('../pages/admin/Reports'))

export default function Router() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <Routes>
        {/* Redirige a /login por defecto */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Rutas públicas */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* Rutas protegidas */}
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/employees" element={<EmployeesManagement />} />
          <Route path="/admin/specialties" element={<SpecialtiesManagement />} />
          <Route path="/admin/appointments" element={<AppointmentsManagement />} />
          <Route path="/admin/medical-centers" element={<MedicalCentersManagement />} />
          <Route path="/admin/doctors" element={<DoctorsManagement />} />
          <Route path="/admin/reports" element={<Reports />} />
        </Route>

        {/* Redirige a login para rutas no encontradas */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  )
}