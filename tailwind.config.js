/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "custom-gray": "#222222", // Closing bracket was missing here
      },
      dropShadow: {
        "glow-red": "0 0 200px rgba(255, 0, 0, 0.7)", // Red glow
        "glow-yellow": "0 0 200px rgba(255, 255, 0, 0.7)", // Yellow glow
      },
    },
  },
  plugins: [],
};
