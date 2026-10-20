import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: "#07352B",
          heading: "#0E3B2E",
          green: "#4CB748",
          greenDark: "#3B9E39",
          pink: "#E6007E",
        },
        footerBlue: "#002664",
      },
      fontFamily: {
        heading: ["var(--font-poppins)", "system-ui", "sans-serif"],
        body: ["var(--font-open-sans)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
