import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { FaCar, FaTools, FaShoppingCart, FaUser, FaSun, FaMoon } from "react-icons/fa";
import AccountDropdown from './AccountDropdown';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
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
    <nav className={`sticky top-0 z-50 backdrop-blur-md border-b ${
      theme === 'dark'
        ? 'bg-gray-900/80 border-gray-700 text-gray-100'
        : 'bg-white/80 border-gray-200 text-gray-900'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center group">
              <FaCar className="h-6 w-6 text-blue-400 group-hover:text-blue-300 transition-colors duration-300" />
              <span className="ml-2 text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
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
                      ? theme === 'dark'
                        ? 'bg-gray-800 text-blue-400 border-b-2 border-blue-400'
                        : 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                      : theme === 'dark'
                        ? 'text-gray-300 hover:text-blue-400 hover:bg-gray-800'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden md:ml-6 md:flex md:items-center space-x-4">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-md transition-colors duration-300 ${
                theme === 'dark'
                  ? 'text-gray-300 hover:text-yellow-400 hover:bg-gray-800'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <FaSun className="w-5 h-5" /> : <FaMoon className="w-5 h-5" />}
            </button>
            {user ? (
              <AccountDropdown />
            ) : (
              <Link
                to="/login"
                className="px-3 py-1 rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition-colors duration-300"
              >
                Login
              </Link>
            )}
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`inline-flex items-center justify-center p-2 rounded-md transition-colors duration-300 ${
                theme === 'dark'
                  ? 'text-gray-300 hover:text-blue-400 hover:bg-gray-800'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
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
        <div className={`md:hidden ${
          theme === 'dark'
            ? 'bg-gray-900/80 backdrop-blur-md'
            : 'bg-white/80 backdrop-blur-md'
        }`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 ${
                  isActive(item.path)
                    ? theme === 'dark'
                      ? 'bg-gray-800 text-blue-400 border-l-4 border-blue-400'
                      : 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                    : theme === 'dark'
                      ? 'text-gray-300 hover:text-blue-400 hover:bg-gray-800'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
            <button
              onClick={toggleTheme}
              className={`w-full flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors duration-300 ${
                theme === 'dark'
                  ? 'text-gray-300 hover:text-yellow-400 hover:bg-gray-800'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              {theme === 'dark' ? (
                <>
                  <FaSun className="mr-2" />
                  Light Mode
                </>
              ) : (
                <>
                  <FaMoon className="mr-2" />
                  Dark Mode
                </>
              )}
            </button>
            {user ? (
              <div className={`pt-4 pb-3 border-t ${
                theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
              }`}>
                <div className={`flex items-center px-5 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  <FaUser className="mr-2 text-blue-400" />
                  <span className="text-sm">{user?.name || 'User'}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="mt-3 w-full flex justify-center px-4 py-2 rounded-md text-sm font-medium text-white bg-[#e57373] hover:bg-[#ef9a9a] transition-colors duration-300"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="block w-full text-center px-4 py-2 rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition-colors duration-300"
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
