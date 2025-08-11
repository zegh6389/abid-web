import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{ts,tsx}',
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          violet: '#8C30F5',
          fuchsia: '#E42FFF',
          teal: '#00C2A8',
          lime: '#A3E635'
        }
      },
      backdropBlur: {
        xs: '2px',
        sm: '6px',
        md: '12px',
        lg: '20px'
      }
    }
  },
  plugins: []
};

export default config;
