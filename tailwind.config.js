/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        rail: {
          navy: '#062b7a',
          blue: '#1d56f0',
          red: '#d90a2e',
          ink: '#0f1733',
          soft: '#f3f6fd',
          pale: '#dfe8ff',
          mist: '#e9eefb',
          white: '#ffffff',
        },
      },
      boxShadow: {
        soft: '0 18px 45px rgba(9, 22, 58, 0.12)',
        panel: '0 28px 70px rgba(9, 22, 58, 0.18)',
      },
      backgroundImage: {
        'rail-hero': 'linear-gradient(135deg, #062b7a 0%, #08205c 50%, #041433 100%)',
      },
    },
  },
  plugins: [],
};
