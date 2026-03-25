/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#059669", // Esmeralda/Verde bosque
        secondary: "#10b981", // Verde vibrante
        accent: "#d97706", // Ámbar para contraste
        "bg-cream": "#f9f5eb", // Beige/Crema suave
        "card-cream": "#ffffff", // Blanco puro para tarjetas
      },
    },
  },
  plugins: [],
}
