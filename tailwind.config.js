/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent1: 'var(--color-accent1)',
        accent2: 'var(--color-accent2)',
        neutral: {
          100: 'var(--color-neutral-100)',
          200: 'var(--color-neutral-200)',
          300: 'var(--color-neutral-300)',
          400: 'var(--color-neutral-400)',
          500: 'var(--color-neutral-500)',
          600: 'var(--color-neutral-600)',
          700: 'var(--color-neutral-700)',
          800: 'var(--color-neutral-800)',
          900: 'var(--color-neutral-900)',
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-hero": "linear-gradient(to bottom, #000000, #0A1828, #000000)",
        "gradient-section": "linear-gradient(to bottom, #000000, #1f2937, #000000 )",
<<<<<<< HEAD
=======
        "gradient-primary-button": "var(--gradient-primary)",
        "gradient-secondary-button": "var(--gradient-secondary)",
        "gradient-danger-button": "var(--gradient-danger)",
        "gradient-success-button": "var(--gradient-success)",
        "gradient-info-button": "var(--gradient-info)",
>>>>>>> c32cb53 (primer commit)
      },
    },
  },
  plugins: [],
};
