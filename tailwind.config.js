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
          light: '#60a5fa', // blue-400
          DEFAULT: '#3b82f6', // blue-500
          dark: '#2563eb', // blue-600
        },
        secondary: {
          light: '#bae6fd', // sky-200
          DEFAULT: '#7dd3fc', // sky-300
          dark: '#38bdf8', // sky-400
        },
        accent: {
          light: '#5eead4', // teal-300
          DEFAULT: '#2dd4bf', // teal-400
          dark: '#14b8a6', // teal-500
        },
        neutral: {
          100: '#f5f5f5', // neutral-100
          200: '#e5e5e5', // neutral-200
          300: '#d4d4d4', // neutral-300
          400: '#a3a3a3', // neutral-400
          500: '#737373', // neutral-500
          600: '#525252', // neutral-600
          700: '#404040', // neutral-700
          800: '#262626', // neutral-800
          900: '#171717', // neutral-900
        },
      },
      fontFamily: {
        jost: ['Jost', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
}