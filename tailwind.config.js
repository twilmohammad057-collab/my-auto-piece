/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  corePlugins: {
    preflight: false, // keeps existing inline-style components intact
  },
  theme: {
    extend: {},
  },
  plugins: [],
};
