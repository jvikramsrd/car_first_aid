import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ErrorBoundary from "./components/ErrorBoundary";
import Layout from "./components/Layout";
import LoadingSpinner from "./components/LoadingSpinner";
import Home from "./pages/Home";
import Diagnose from "./pages/Diagnose";
import Mechanics from "./pages/Mechanics";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Marketplace from "./pages/Marketplace";
import DiagnosisHistory from "./pages/DiagnosisHistory";
import Account from "./pages/Account";
import AIDiagnosis from './components/AIDiagnosis';

// Separate component for protected routes
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  return user ? children : <Navigate to="/login" />;
};

// Separate component for the app content to use hooks properly
const AppContent = () => {
  const { theme } = useTheme();
  
  return (
    <ErrorBoundary>
      <Layout>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/diagnose" element={<Diagnose />} />
            <Route path="/mechanics" element={<Mechanics />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/account" 
              element={
                <PrivateRoute>
                  <Account />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/marketplace" 
              element={
                <PrivateRoute>
                  <Marketplace />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/diagnosis-history" 
              element={
                <PrivateRoute>
                  <DiagnosisHistory />
                </PrivateRoute>
              } 
            />
            <Route path="/ai-diagnosis" element={<AIDiagnosis />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </Layout>
      <ToastContainer 
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={theme}
        toastClassName={`${
          theme === 'dark' 
            ? 'bg-gray-800 text-gray-100' 
            : 'bg-white text-gray-800'
        } border-l-4 border-primary`}
        progressClassName="bg-primary"
      />
    </ErrorBoundary>
  );
};

// Main App component
const App = () => {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App;