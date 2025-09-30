/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        playfair: ['var(--font-playfair)', 'serif'],
      },
      colors: {
        // Pizza-themed color palette
        pizza: {
          red: {
            50: '#fef2f2',
            100: '#fee2e2',
            200: '#fecaca',
            300: '#fca5a5',
            400: '#f87171',
            500: '#ef4444',  // Main red
            600: '#dc2626',
            700: '#b91c1c',  // Deep red
            800: '#991b1b',
            900: '#7f1d1d',
          },
          golden: {
            50: '#fffbeb',
            100: '#fef3c7',
            200: '#fde68a',
            300: '#fcd34d',
            400: '#fbbf24',  // Golden yellow
            500: '#f59e0b',
            600: '#d97706',  // Deep amber
            700: '#b45309',
            800: '#92400e',
            900: '#78350f',
          },
        },
        primary: {
          DEFAULT: '#dc2626',  // Deep red
          foreground: '#ffffff',
        },
        destructive: {
          DEFAULT: '#991b1b',
          foreground: '#ffffff',
        },
      },
    },
  },
} satisfies Config;
