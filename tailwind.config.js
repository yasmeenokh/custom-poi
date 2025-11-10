/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,html}", // your project files
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Quicksand', 'ui-sans-serif', 'system-ui'], // main font
      },
    },
  },
  plugins: [],
}
