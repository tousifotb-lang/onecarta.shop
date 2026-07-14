import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  "#eeedf5",
          100: "#d5d4e8",
          200: "#acabd1",
          300: "#7b79b8",
          400: "#5250a0",
          500: "#2c2769",
          600: "#252263",
          700: "#1e1a52",
          800: "#161440",
          900: "#0e0d2e",
        },
        secondary: {
          DEFAULT: "#39378c",
          light: "#4a48a0",
          dark: "#2d2b75",
        },
        brand: "#2c2769",
      },
      fontFamily: {
        sans: ["Oswald", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;