// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-bg': '242424',
        'light-bg': 'ffffff',
        'link-blue': '646cff',
        'link-blue-hover': '535bf2',
        'light-button-bg': 'f9f9f9',
        'dark-button-bg': '1a1a1a',
        'light-text': '213547',
        'dark-text': 'rgba(255, 255, 255, 0.87)',
      },
    },
  },
  plugins: [],
}