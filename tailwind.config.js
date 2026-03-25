/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0ea5e9",
        secondary: "#ec4899",
        accent: "#f59e0b",
        "bg-dark": "#050505",
      },
    },
  },
  plugins: [],
}
