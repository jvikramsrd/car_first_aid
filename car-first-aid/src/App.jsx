import React, { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import ErrorBoundary from "./components/ErrorBoundary";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Diagnose from "./pages/Diagnose";
import Mechanics from "./pages/Mechanics";
import Login from "./pages/Login";
import Marketplace from "./pages/Marketplace";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <ErrorBoundary>
          <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
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
              theme="light"
            />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/diagnose" element={<Diagnose />} />
              <Route path="/mechanics" element={<Mechanics />} />
              <Route path="/login" element={<Login />} />
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
          <footer className="mt-12 py-6 bg-gray-800 text-white">
            <div className="container mx-auto text-center">
              <div className="flex justify-center space-x-6 mb-4">
                <a href="#" className="hover:text-orange-500">
                  <i className="fas fa-car text-xl"></i>
                </a>
                <a href="#" className="hover:text-orange-500">
                  <i className="fas fa-tools text-xl"></i>
                </a>
                <a href="#" className="hover:text-orange-500">
                  <i className="fas fa-shopping-cart text-xl"></i>
                </a>
              </div>
              <p className="text-sm">
                © 2025 CarFirstAid. All rights reserved. | 
                <a href="#" className="ml-2 hover:text-orange-500">Terms</a> | 
                <a href="#" className="ml-2 hover:text-orange-500">Privacy</a>
              </p>
            </div>
          </footer>
          </div>
        </ErrorBoundary>
      </AuthProvider>
    </Router>
  );
};

export default App;