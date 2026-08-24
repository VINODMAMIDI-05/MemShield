/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: "#0F172A", // slate-900
          card: "#1E293B", // slate-800
          border: "#334155", // slate-700
          primary: "#3B82F6", // blue-500
          accent: "#10B981", // emerald-500
          danger: "#EF4444", // red-500
        }
      }
    },
  },
  plugins: [],
}
