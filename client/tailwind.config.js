/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'maroon': '#800000',
        'dark-maroon': '#600000',
      }
    },
  },
  plugins: [],
}
