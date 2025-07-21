import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AppLayout from '../components/layout/AppLayout';
import Dashboard from '../pages/Dashboard';
import TenantManagement from '../pages/TenantManagement';
import LoginPage from '../pages/LoginPage';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const token = useSelector((state) => state.auth.token);
  
  // Check if user is authenticated (either from Redux state or localStorage)
  const hasValidAuth = isAuthenticated || localStorage.getItem('token') || token;
  
  return hasValidAuth ? children : <Navigate to="/login" replace />;
};

// Public Route component (redirects to dashboard if already authenticated)
const PublicRoute = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const token = useSelector((state) => state.auth.token);
  
  const hasValidAuth = isAuthenticated || localStorage.getItem('token') || token;
  
  return hasValidAuth ? <Navigate to="/dashboard" replace /> : children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        } 
      />
      
      {/* Protected Routes */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <Dashboard />
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/tenants" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <TenantManagement />
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/users" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <div>User Management Page (To be implemented)</div>
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/devices" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <div>Device Management Page (To be implemented)</div>
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/alerts" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <div>Alerts & Monitoring Page (To be implemented)</div>
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/subscriptions" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <div>Subscriptions Page (To be implemented)</div>
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/settings" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <div>System Settings Page (To be implemented)</div>
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      
      {/* Default Routes */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;

