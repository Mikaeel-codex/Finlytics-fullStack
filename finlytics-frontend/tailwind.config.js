/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#eef8f5",
          100: "#d6efe7",
          200: "#b0e0d2",
          300: "#84cdb8",
          400: "#56b89d",
          500: "#2a9c82",   // primary teal
          600: "#1f7e6a",
          700: "#196556",
          800: "#134e43",
          900: "#0f3d35"
        },
        accent: "#f4b400"   // gold progress bar like your mock
      },
      borderRadius: {
        xl2: "1.25rem"
      }
    },
  },
  plugins: [],
};
