/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Matched to the real Alinma app DARK theme (user's reference
        // mockup): deep teal-navy canvas, coral squircle tiles, cream text,
        // violet reserved for "new feature" accents.
        ink: {
          DEFAULT: '#0C2431', // canvas
          card: '#14323F',    // raised card
          soft: '#1B4152',    // higher surface / pills
        },
        coral: {
          DEFAULT: '#F0846A', // accent text / highlights
          tile: '#F2917B',    // quick-action squircles
          deep: '#E4584C',    // badges
          light: '#F6DFD3',
        },
        cream: '#F4EFE9',
        violet: '#8B7BF5',
        // Navy kept for light surfaces (celebration cards, onboarding CTA).
        alinma: {
          DEFAULT: '#1B2B45',
          dark: '#0F1D33',
          light: '#F7F1EA',
        },
        sand: '#8c5e3c',
        coin: '#F5A623',
      },
    },
  },
  plugins: [],
}
