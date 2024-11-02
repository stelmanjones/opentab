import { fontFamily } from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: ["class"],
  content: ["./src/**/*.{html,js,svelte,ts}"],
  safelist: ["dark"],
  plugins: [require("@tailwindcss/forms"), require("daisyui")],
  daisyui: {
    themes: ["lofi"], // false: only light + dark | true: all themes | array: specific themes like this ["light", "dark", "cupcake"]
    darkTheme: "dark", // name of one of the included themes for dark mode
    base: true, // applies background color and foreground color for root element by default
    styled: true, // include daisyUI colors and design decisions for all components
    utils: true, // adds responsive and modifier utility classes
    prefix: "", // prefix for daisyUI classnames (components, modifiers and responsive class names. Not colors)
    logs: true, // Shows info about daisyUI version and used config in the console when building your CSS
    themeRoot: ":root", // The element that receives theme color CSS variables
  },
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        bg: {
          DEFAULT: "#2e3948",
        },
        bgdark: {
          DEFAULT: "#1E252F",
        },
        bglight: {
          DEFAULT: "#3D4D61",
        },
        bglighter: {
          DEFAULT: "#4d617a",
        },
        vivid_sky_blue: {
          DEFAULT: "#02cdf9",
          100: "#002931",
          200: "#015163",
          300: "#017a94",
          400: "#02a2c6",
          500: "#02cdf9",
          600: "#31d8fd",
          700: "#65e1fd",
          800: "#98ebfe",
          900: "#ccf5fe",
        },
        pale_azure: {
          DEFAULT: "#70d6ff",
          100: "#003549",
          200: "#006993",
          300: "#009edc",
          400: "#27c2ff",
          500: "#70d6ff",
          600: "#8ddfff",
          700: "#a9e7ff",
          800: "#c6efff",
          900: "#e2f7ff",
        },
        neon_magenta: {
          DEFAULT: "#9747ff",
          100: "#1c0041",
          200: "#390083",
          300: "#5500c4",
          400: "#7206ff",
          500: "#9747ff",
          600: "#ac6cff",
          700: "#c191ff",
          800: "#d5b6ff",
          900: "#eadaff",
        },
        hotpink: {
          DEFAULT: "#ff70a6",
          100: "#49001c",
          200: "#930038",
          300: "#dc0054",
          400: "#ff277a",
          500: "#ff70a6",
          600: "#ff8db9",
          700: "#ffa9ca",
          800: "#ffc6dc",
          900: "#ffe2ed",
        },
        neon_red: {
          DEFAULT: "#ff4a53",
          100: "#420003",
          200: "#850007",
          300: "#c7000a",
          400: "#ff0a16",
          500: "#ff4a53",
          600: "#ff7077",
          700: "#ff9499",
          800: "#ffb8bb",
          900: "#ffdbdd",
        },
        neon_orange: {
          DEFAULT: "#ff7543",
          100: "#401100",
          200: "#812200",
          300: "#c13300",
          400: "#ff4502",
          500: "#ff7543",
          600: "#ff9068",
          700: "#ffac8e",
          800: "#ffc8b4",
          900: "#ffe3d9",
        },
        naples_yellow: {
          DEFAULT: "#ffd770",
          100: "#493500",
          200: "#936900",
          300: "#dc9e00",
          400: "#ffc227",
          500: "#ffd770",
          600: "#ffdf8d",
          700: "#ffe7a9",
          800: "#ffefc6",
          900: "#fff7e2",
        },
        neon_green: {
          DEFAULT: "#bcff68",
          100: "#274700",
          200: "#4f8f00",
          300: "#76d600",
          400: "#9aff1f",
          500: "#bcff68",
          600: "#c8ff85",
          700: "#d6ffa3",
          800: "#e3ffc2",
          900: "#f1ffe0",
        },
        alabaster: {
          DEFAULT: "#efebdf",
          100: "#3e361f",
          200: "#7b6c3e",
          300: "#b19e65",
          400: "#d1c5a3",
          500: "#efebdf",
          600: "#f3f0e7",
          700: "#f6f4ed",
          800: "#f9f7f3",
          900: "#fcfbf9",
        },
        primary: {
          DEFAULT: "#facc14",
          50: "#fefce8",
          100: "#fef9c3",
          200: "#fef08a",
          300: "#fde047",
          400: "#facc14",
          500: "#eab308",
          600: "#ca8a04",
          700: "#a16207",
          800: "#854d0e",
          900: "#713f12",
          950: "#422006",
        },
      },
      fontFamily: {
        sans: ["Geist Sans", "sans-serif"],
        serif: ["Geistura", "serif"],
        mono: ["Geistura", "monospace"],
      },
    },
  },
};

export default config;
