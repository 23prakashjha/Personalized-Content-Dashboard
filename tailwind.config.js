/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["DM Sans", "sans-serif"],
        editorial: ["Playfair Display", "serif"],
      },
      colors: {
        ink: "#20231f",
        moss: "#55745f",
        paper: "#f8f8f6",
      },
    },
  },
  plugins: [],
};
