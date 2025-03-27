import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        '13': 'repeat(13, minmax(0, 1fr))',
      },
      colors: {
        blue: {
          400: '#2589FE',
          500: '#0070F3',
          600: '#2F6FEB',
        },
        cream: '#F6F1DE',
        slate: '#3E3F5B',
        sage: '#8AB2A6',
        mint: '#ACD3A8',
        navy: {
          100: '#E6EEF3',
          200: '#CDDDE8',
          300: '#B3CCDC',
          400: '#9ABBD0',
          500: '#81AAC5',
          600: '#6799B9',
          700: '#4E88AD',
          800: '#3477A1',
          900: '#205781',
        },
        primary: {
          50: '#F6F1DE',
          100: '#F0E9D0',
          200: '#EAE0C1',
          300: '#E3D7B3',
          400: '#DDCEA4',
          500: '#D6C595',
          600: '#CFBD87',
          700: '#C9B478',
          800: '#C2AB6A',
          900: '#BCA25B',
        },
        secondary: {
          50: '#EAEAEF',
          100: '#D5D6DF',
          200: '#C0C1CF',
          300: '#ABADBE',
          400: '#9698AE',
          500: '#81839E',
          600: '#6B6E8D',
          700: '#56597D',
          800: '#41446C',
          900: '#3E3F5B',
        },
        accent: {
          50: '#F0F6F3',
          100: '#E1EDE8',
          200: '#D2E4DD',
          300: '#C3DBD1',
          400: '#B4D2C6',
          500: '#A5C9BB',
          600: '#96C0B0',
          700: '#87B7A4',
          800: '#8AB2A6',
          900: '#78AE99',
        },
        success: {
          50: '#F4F9F3',
          100: '#E9F3E7',
          200: '#DEEDDB',
          300: '#D3E7CF',
          400: '#C8E1C3',
          500: '#BDDBB7',
          600: '#B2D5AB',
          700: '#A7CF9F',
          800: '#ACD3A8',
          900: '#96C38C',
        }
      },
    },
    keyframes: {
      shimmer: {
        '100%': {
          transform: 'translateX(100%)',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require("tailwindcss-animate")],
};
export default config;
