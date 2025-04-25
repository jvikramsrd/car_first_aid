import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaHistory, FaCog, FaSignOutAlt } from 'react-icons/fa';

const AccountDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-800/80 hover:bg-gray-700/80 border border-gray-700/50 hover:border-blue-400/30 transition-all duration-300"
      >
        <FaUser className="text-blue-400" />
        <span className="text-gray-200">{user?.name || 'Account'}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl bg-gray-800/95 backdrop-blur-xl border border-gray-700/50 shadow-lg py-2 z-50">
          <Link
            to="/account"
            className="flex items-center gap-3 px-4 py-2 text-gray-200 hover:bg-gray-700/80 transition-colors duration-300"
          >
            <FaUser className="text-blue-400" />
            My Account
          </Link>
          <Link
            to="/diagnosis-history"
            className="flex items-center gap-3 px-4 py-2 text-gray-200 hover:bg-gray-700/80 transition-colors duration-300"
          >
            <FaHistory className="text-blue-400" />
            Diagnosis History
          </Link>
          <Link
            to="/settings"
            className="flex items-center gap-3 px-4 py-2 text-gray-200 hover:bg-gray-700/80 transition-colors duration-300"
          >
            <FaCog className="text-blue-400" />
            Settings
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 text-red-400 hover:bg-gray-700/80 transition-colors duration-300"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default AccountDropdown; 