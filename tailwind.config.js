/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        editor: {
          bg: "#1e1e1e",
          sidebar: "#252526",
          tab: "#2d2d30",
        },
      },
    },
  },
  plugins: [],
}
