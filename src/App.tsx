import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import LoadingSpinner from './components/ui/LoadingSpinner';
import Layout from './components/layout/Layout';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import useAuth from './hooks/useAuth';

// Lazy-loaded components
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const ProjectDetails = lazy(() => import('./pages/ProjectDetails'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Profile = lazy(() => import('./pages/Profile'));

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/" element={
        isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
      } />
      <Route path="/login" element={
        <Suspense fallback={<LoadingSpinner />}>
          {isAuthenticated ? <Navigate to="/dashboard" /> : <Login />}
        </Suspense>
      } />
      <Route path="/signup" element={
        <Suspense fallback={<LoadingSpinner />}>
          {isAuthenticated ? <Navigate to="/dashboard" /> : <Signup />}
        </Suspense>
      } />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Layout>
            <Suspense fallback={<LoadingSpinner />}>
              <Dashboard />
            </Suspense>
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/projects/:projectId" element={
        <ProtectedRoute>
          <Layout>
            <Suspense fallback={<LoadingSpinner />}>
              <ProjectDetails />
            </Suspense>
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <Layout>
            <Suspense fallback={<LoadingSpinner />}>
              <Profile />
            </Suspense>
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="*" element={
        <Suspense fallback={<LoadingSpinner />}>
          <NotFound />
        </Suspense>
      } />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
        <ToastContainer position="top-right" autoClose={3000} />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;