import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './*.html',
    './site-*.js',
  ],
  theme: {
    extend: {
      colors: {
        mokdaOrange: '#ef5f18',
        mokdaGreen: '#02674f',
        mokdaCream: '#f7ddc2',
        mokdaBrown: '#321506',
      },
    },
  },
  plugins: [],
};

export default config;
