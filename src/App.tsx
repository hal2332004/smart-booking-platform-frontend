import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PublicLayout } from '@/components/PublicLayout';
import { AdminLayout } from '@/components/AdminLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { HomePage } from '@/pages/HomePage';
import { ApartmentsPage } from '@/pages/ApartmentsPage';
import { ApartmentDetailPage } from '@/pages/ApartmentDetailPage';
import { AdminLoginPage } from '@/pages/AdminLoginPage';
import { AdminDashboardPage } from '@/pages/AdminDashboardPage';
import { AdminApartmentsPage } from '@/pages/AdminApartmentsPage';
import { AdminApartmentFormPage } from '@/pages/AdminApartmentFormPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/apartments" element={<ApartmentsPage />} />
          <Route path="/apartments/:slug" element={<ApartmentDetailPage />} />
        </Route>

        <Route path="/admin/login" element={<AdminLoginPage />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboardPage />} />
          <Route path="apartments" element={<AdminApartmentsPage />} />
          <Route path="apartments/create" element={<AdminApartmentFormPage />} />
          <Route path="apartments/edit/:id" element={<AdminApartmentFormPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
