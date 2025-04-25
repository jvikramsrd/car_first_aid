import React from 'react';
import { useTheme } from '../context/ThemeContext';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen ${
      theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'
    }`}>
      <Navbar />
      <main className={`min-h-[calc(100vh-4rem)] relative overflow-hidden ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900'
          : 'bg-gradient-to-br from-blue-50 via-gray-50 to-blue-50'
      }`}>
        {/* Racing stripe inspired decorative elements */}
        <div className={`absolute inset-0 ${
          theme === 'dark'
            ? 'opacity-10'
            : 'opacity-5'
        }`}>
          <div className="absolute right-0 top-0 w-96 h-full transform rotate-12 translate-x-32 bg-gradient-to-b from-red-500 to-red-600"></div>
          <div className="absolute right-0 top-0 w-96 h-full transform rotate-12 translate-x-48 bg-gradient-to-b from-blue-500 to-blue-600"></div>
        </div>
        {/* Content wrapper with backdrop blur for better readability */}
        <div className="relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout; 