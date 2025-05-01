/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
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
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}
