/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
        lexend: ['Lexend', 'sans-serif']
      },
      colors: {
        brandBlue: '#1977F2',
        brandBlack: '#404040'
      },
    },
  },
  plugins: [require("tw-elements/dist/plugin")]
}