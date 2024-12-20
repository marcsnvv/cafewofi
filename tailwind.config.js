module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/modules/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'hero': "url('/bg.png')",
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        lightgray: "#F4F7FF",
        gray: "#6F6B7B",
        brand: "#CC7843",
        secondary: "#3F1C04",
        lightbrand: "#FFE8D9",
        darkgray: "#111111",
      },
      fontFamily: {
        nyght: "var(--font-nyght)",
        roboto: "var(--font-roboto)"
      },
      fontSize: {
        '2xs': '.5rem',
        '3xs': '.625rem',
        '4xs': '.75rem',
        '5xs': '.875rem',
        '6xs': '1em',
        '7xl': '5em',
        '8xl': '6em',
        '9xl': '8em',
      },
    },
  },
  plugins: [],
}
