/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Matched to the real Alinma app (2026 design): warm cream canvas,
        // dark navy ink as the primary, coral as the sparing accent.
        alinma: {
          DEFAULT: '#1B2B45', // navy ink — buttons, icons, headings
          dark: '#0F1D33',
          light: '#F7F1EA',   // cream canvas
        },
        coral: {
          DEFAULT: '#E97C61', // accent — active states, highlights
          light: '#F6DFD3',   // avatar/chip tint
        },
        sand: '#8c5e3c',
        coin: '#F5A623',
      },
    },
  },
  plugins: [],
}
