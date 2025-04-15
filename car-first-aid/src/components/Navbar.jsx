import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaCar, FaTools, FaShoppingCart, FaUser } from "react-icons/fa";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { path: '/', label: 'Home', icon: <FaCar className="mr-1" /> },
    { path: '/diagnose', label: 'Diagnose', icon: <FaTools className="mr-1" /> },
    { path: '/mechanics', label: 'Mechanics', icon: <FaTools className="mr-1" /> },
    { path: '/marketplace', label: 'Marketplace', icon: <FaShoppingCart className="mr-1" /> },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-surface/80 backdrop-blur-md border-b border-primary/20 text-text shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center group">
              <FaCar className="h-6 w-6 text-primary group-hover:text-primary-light transition-colors duration-300" />
              <span className="ml-2 text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                CarFirstAid
              </span>
            </Link>
            <div className="hidden md:ml-6 md:flex md:space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                    isActive(item.path)
                      ? 'bg-primary/10 text-primary border-b-2 border-primary'
                      : 'text-text-secondary hover:text-primary hover:bg-primary/5'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden md:ml-6 md:flex md:items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm flex items-center text-text-secondary">
                  <FaUser className="mr-1 text-primary" />
                  {user?.name || 'User'}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1 rounded-md text-sm font-medium text-white bg-danger hover:bg-danger/80 transition-colors duration-300"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-3 py-1 rounded-md text-sm font-medium text-white bg-success hover:bg-success/80 transition-colors duration-300"
              >
                Login
              </Link>
            )}
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-text-secondary hover:text-primary hover:bg-primary/5 transition-colors duration-300"
            >
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-surface/80 backdrop-blur-md">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 ${
                  isActive(item.path)
                    ? 'bg-primary/10 text-primary border-l-4 border-primary'
                    : 'text-text-secondary hover:text-primary hover:bg-primary/5'
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
            {user ? (
              <div className="pt-4 pb-3 border-t border-primary/20">
                <div className="flex items-center px-5 text-text-secondary">
                  <FaUser className="mr-2 text-primary" />
                  <span className="text-sm">{user?.name || 'User'}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="mt-3 w-full flex justify-center px-4 py-2 rounded-md text-sm font-medium text-white bg-danger hover:bg-danger/80 transition-colors duration-300"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="block w-full text-center px-4 py-2 rounded-md text-sm font-medium text-white bg-success hover:bg-success/80 transition-colors duration-300"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
