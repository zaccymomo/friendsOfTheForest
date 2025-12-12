/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: '#2c2c2c',
        warning: '#ffe8a3',
        background: '#ffffff',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        baloo: ['Baloo 2', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

