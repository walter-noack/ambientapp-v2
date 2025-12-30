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
          50: '#e6f2ed',
          100: '#cce5db',
          200: '#99cbb7',
          300: '#66b193',
          400: '#33976f',
          500: '#005429', // Tu verde oscuro principal
          600: '#004321',
          700: '#003219',
          800: '#002110',
          900: '#001108',
        },
        accent: {
          50: '#f3fce8',
          100: '#e7f9d1',
          200: '#cff3a3',
          300: '#b7ed75',
          400: '#9fe747',
          500: '#73c91b', // Tu verde claro
          600: '#5ca116',
          700: '#457910',
          800: '#2e500b',
          900: '#172805',
        },
        secondary: {
          50: '#e6f2ff',
          100: '#cce5ff',
          200: '#99cbff',
          300: '#66b1ff',
          400: '#3397ff',
          500: '#0068ec', // Tu azul
          600: '#0053bd',
          700: '#003e8e',
          800: '#002a5e',
          900: '#00152f',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}