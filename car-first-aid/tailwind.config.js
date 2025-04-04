/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'media', // or 'class' if you're toggling manually
  theme: {
    extend: {
      colors: {
        // Car-Inspired Theme
        'car-red': '#ff3c00',
        'car-red-hover': '#ff5722',
        'car-dark': '#1c1e22',
        'car-darker': '#121417',
        'car-gray': '#2a2d34',
        'carbon-fiber': '#1f2125',

        // Light Mode Contrast
        'light-bg': '#ffffff',
        'silver-car': '#f5f5f5',
        'light-gray': '#e0e0e0',
        'light-text': '#213547',
        'light-accent': '#d32f2f',

        // Dark Mode Contrast
        'dark-bg': '#242424',
        'dark-button-bg': '#1a1a1a',
        'dark-text': 'rgba(255, 255, 255, 0.87)',

        // Link colors
        'link-blue': '#646cff',
        'link-blue-hover': '#535bf2',

        // Button backgrounds
        'light-button-bg': '#f9f9f9',
      },
    },
  },
  plugins: [],
}
