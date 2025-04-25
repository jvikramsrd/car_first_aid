import React from 'react';
import { useTheme } from '../context/ThemeContext';

const LoadingSpinner = () => {
  const { theme } = useTheme();
  
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="relative">
        <div className={`w-12 h-12 rounded-full border-4 border-t-transparent animate-spin ${
          theme === 'dark' 
            ? 'border-blue-500' 
            : 'border-blue-600'
        }`}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className={`w-8 h-8 rounded-full border-2 border-t-transparent animate-spin ${
            theme === 'dark'
              ? 'border-indigo-400'
              : 'border-indigo-500'
          }`}></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner; 