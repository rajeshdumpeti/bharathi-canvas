/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#2563eb", // blue-600
          light: "#3b82f6",
          dark: "#1e40af",
        },
      },
    },
  },
  plugins: [],
}