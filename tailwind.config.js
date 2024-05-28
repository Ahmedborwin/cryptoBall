/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans"],
      },
      screens: {
        mdd: "991px",
      },
      colors: {
        "dark-green": "#006400", // Custom color for values above 80
        green: "#008000", // Custom color for values between 71 and 80
        yellow: "#FFFF00", // Custom color for values below 71
      },
    },
  },
  plugins: [],
}
