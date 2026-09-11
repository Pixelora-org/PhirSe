import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#1C2B22",
        paper: "#F6F4EE",
        "paper-raised": "#FFF",
        line: "#DAD5C8",
        gold: "#C98A2C",
        cardboard: "#A9754A",
        petmetal: "#3B6E8F",
        rigid: "#7C8792",
        green: "#3F6B4A",
        red: "#B5502E",
      },
      fontFamily: {
        brand: ['"Barlow Condensed"', 'sans-serif'],
        sans: ['"IBM Plex Sans"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};
export default config;
