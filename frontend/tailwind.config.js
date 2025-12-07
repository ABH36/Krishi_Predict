/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        farm: {
          green: "#2E7D32", // Fasal Green
          gold: "#F9A825",  // Wheat Gold
          light: "#E8F5E9", // Light Green Background
          dark: "#1B5E20"   // Dark Text
        }
      }
    },
  },
  plugins: [],
}