import { tailwindPreset } from './src/design/theme/tailwind-preset.ts';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  presets: [tailwindPreset],
  theme: {
    extend: {},
  },
  plugins: [],
};
