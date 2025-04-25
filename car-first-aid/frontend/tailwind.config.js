/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable dark mode with class strategy
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3B82F6', // blue-500
          dark: '#2563EB', // blue-600
        },
        secondary: {
          DEFAULT: '#6366F1', // indigo-500
          dark: '#4F46E5', // indigo-600
        },
        accent: {
          DEFAULT: '#8B5CF6', // violet-500
          dark: '#7C3AED', // violet-600
        },
        surface: {
          light: '#FFFFFF',
          dark: '#1F2937', // gray-800
        },
        background: {
          light: '#F3F4F6', // gray-100
          dark: '#111827', // gray-900
        },
        text: {
          light: '#1F2937', // gray-800
          dark: '#F9FAFB', // gray-50
        },
        // Car-Inspired Theme
        'car-red': '  ff3c00',
        'car-red-hover': '  ff5722',
        'car-dark': '  1c1e22',
        'car-darker': '  121417',
        'car-gray': '  2a2d34',
        'carbon-fiber': '  1f2125',

        // Light Mode Contrast
        'light-bg': '  ffffff',
        'silver-car': '  f5f5f5',
        'light-gray': '  e0e0e0',
        'light-text': '  213547',
        'light-accent': '  d32f2f',

        // Dark Mode Contrast
        'dark-bg': '  242424',
        'dark-button-bg': '  1a1a1a',
        'dark-text': 'rgba(255, 255, 255, 0.87)',

        // Link colors
        'link-blue': '  646cff',
        'link-blue-hover': '  535bf2',

        // Button backgrounds
        'light-button-bg': '  f9f9f9',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
}
