import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { AuthLayout } from '@/layouts/AuthLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';

// Auth Pages
import { Login } from '@/pages/auth/Login';
import { Register } from '@/pages/auth/Register';
import { ForgotPassword } from '@/pages/auth/ForgotPassword';
import { ResetPassword } from '@/pages/auth/ResetPassword';

// Main Pages
import { Dashboard } from '@/pages/Dashboard';
import { Profile } from '@/pages/Profile';
import { Sheets } from '@/pages/Sheets';
import { Reports } from '@/pages/Reports';
import { ReportDetail } from '@/pages/ReportDetail';
import { SharedReport } from '@/pages/SharedReport';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Shared Report Route */}
        <Route path="/shared/:shareToken" element={<SharedReport />} />

        {/* Auth Routes */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />
          <Route index element={<Navigate to="/auth/login" replace />} />
        </Route>

        {/* Main Application Routes (Protected) */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/sheets" element={<Sheets />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/reports/:id" element={<ReportDetail />} />
            <Route path="/settings" element={<div className="p-4">Settings Page (Coming Soon)</div>} />
          </Route>
        </Route>
        
        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
