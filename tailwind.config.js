/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#6366f1", // Indigo Startup
        secondary: "#8b5cf6", // Violet
        accent: "#1e293b", // Deep Slate
        "startup-bg": "#f8fafc", // Very subtle off-white
        "startup-card": "#ffffff",
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      }
    },
  },
  plugins: [],
}
