import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ErrorBoundary from "./components/ErrorBoundary";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Diagnose from "./pages/Diagnose";
import Mechanics from "./pages/Mechanics";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Marketplace from "./pages/Marketplace";

// Separate component for protected routes
const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

// Separate component for the app content to use hooks properly
const AppContent = () => {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-b from-secondary to-metallic relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--primary)_0%,_transparent_50%)] opacity-20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--accent)_0%,_transparent_50%)] opacity-20"></div>
        <Navbar />
        <main className="container mx-auto px-4 py-8 relative z-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/diagnose" element={<Diagnose />} />
            <Route path="/mechanics" element={<Mechanics />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/marketplace" 
              element={
                <PrivateRoute>
                  <Marketplace />
                </PrivateRoute>
              } 
            />
          </Routes>
        </main>
        <footer className="mt-12 py-6 bg-surface/80 backdrop-blur-md border-t border-primary/20 text-text relative z-10">
          <div className="container mx-auto text-center">
            <div className="flex justify-center space-x-6 mb-4">
              <a href="#" className="hover:text-primary transition-colors duration-300">
                <i className="fas fa-car text-xl"></i>
              </a>
              <a href="#" className="hover:text-primary transition-colors duration-300">
                <i className="fas fa-tools text-xl"></i>
              </a>
              <a href="#" className="hover:text-primary transition-colors duration-300">
                <i className="fas fa-shopping-cart text-xl"></i>
              </a>
            </div>
            <p className="text-sm text-text-secondary">
              © 2025 CarFirstAid. All rights reserved. | 
              <a href="#" className="ml-2 hover:text-primary transition-colors duration-300">Terms</a> | 
              <a href="#" className="ml-2 hover:text-primary transition-colors duration-300">Privacy</a>
            </p>
          </div>
        </footer>
      </div>
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
        theme="dark"
        toastClassName="bg-surface text-text border-l-4 border-primary"
        progressClassName="bg-primary"
      />
    </ErrorBoundary>
  );
};

// Main App component
const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
};

export default App;