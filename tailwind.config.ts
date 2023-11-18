import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // Note the addition of the `app` directory.
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    // spacing: {
    //   px: "1px",
    //   0: "0",
    //   0.5: "0.125rem",
    //   1: "0.25rem",
    //   1.5: "0.375rem",
    //   2: "0.5rem",
    //   2.5: "0.625rem",
    //   3: "0.75rem",
    //   3.5: "0.875rem",
    //   4: "1rem",
    //   5: "1.25rem",
    //   6: "1.5rem",
    //   7: "1.75rem",
    //   8: "2rem",
    //   9: "2.25rem",
    //   10: "2.5rem",
    // },
    borderRadius: {
      none: "0",
      sm: ".125rem",
      DEFAULT: ".25rem",
      lg: ".5rem",
      full: "9999px",
    },
  },
  plugins: [],
};
export default config;
