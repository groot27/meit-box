/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#e8f0fe",
          100: "#d2e3fc",
          200: "#a6c7ff",
          300: "#7baaf7",
          400: "#4285f4",
          500: "#1a73e8",
          600: "#1557b0",
          700: "#174ea6",
          800: "#185abc",
          900: "#1967d2",
        },
        gray: {
          50: "#f8f9fa",
          100: "#f1f3f4",
          200: "#e8eaed",
          300: "#dadce0",
          400: "#bdc1c6",
          500: "#9aa0a6",
          600: "#80868b",
          700: "#5f6368",
          800: "#3c4043",
          900: "#202124",
        },
      },
      boxShadow: {
        modal:
          "0 24px 38px 3px rgba(0,0,0,0.14), 0 9px 46px 8px rgba(0,0,0,0.12), 0 11px 15px -7px rgba(0,0,0,0.2)",
      },
      keyframes: {
        "loading-bar": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(200%)" },
        },
      },
      animation: {
        "loading-bar": "loading-bar 1.2s linear infinite",
      },
    },
  },
  plugins: [],
};
