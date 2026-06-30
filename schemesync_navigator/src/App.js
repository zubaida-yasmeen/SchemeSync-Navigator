import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SchemeForm from './components/user/SchemeForm';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import AdminLogin from './components/auth/AdminLogin';
import UserDashboard from './components/user/Dashboard';
import Profile from './components/user/Profile';
import Applications from './components/user/Applications';
import Favorites from './components/user/Favorites';
import AdminDashboard from './components/admin/AdminDashboard';
import SchemeManagement from './components/admin/SchemeManagement';
import ApplicationManagement from './components/admin/ApplicationManagement';
import ProtectedRoute from './components/layout/ProtectedRoute';
import './App.css';

// Add this component BEFORE function App()
const RoleBasedRedirect = () => {
  const { isAdmin } = useAuth();
  
  if (isAdmin) {
    return <Navigate to="/admin" replace />;
  }
  
  return <UserDashboard />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            
            {/* Protected User Routes - With Admin Redirect */}
            <Route path="/" element={
              <ProtectedRoute>
                <RoleBasedRedirect />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/applications" element={
              <ProtectedRoute>
                <Applications />
              </ProtectedRoute>
            } />
            <Route path="/favorites" element={
              <ProtectedRoute>
                <Favorites />
              </ProtectedRoute>
            } />
            
            {/* Protected Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute adminRequired>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/schemes" element={
              <ProtectedRoute adminRequired>
                <SchemeManagement />
              </ProtectedRoute>
            } />
            <Route path="/admin/applications" element={
              <ProtectedRoute adminRequired>
                <ApplicationManagement />
              </ProtectedRoute>
            } />
            
            {/* NEW ROUTES - Scheme Create/Edit */}
            <Route path="/admin/schemes/create" element={
              <ProtectedRoute adminRequired>
                <SchemeForm />
              </ProtectedRoute>
            } />
            <Route path="/admin/schemes/edit/:id" element={
              <ProtectedRoute adminRequired>
                <SchemeForm />
              </ProtectedRoute>
            } />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
