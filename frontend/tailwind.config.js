/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Alinma brand: teal is the primary identity; the warm brown the app
        // used before is Alinma's real secondary, demoted to accent duty.
        alinma: {
          DEFAULT: '#009C8E',
          dark: '#00766B',
          light: '#E6F5F3',
        },
        sand: '#8c5e3c',
        coin: '#F5A623',
      },
    },
  },
  plugins: [],
}
