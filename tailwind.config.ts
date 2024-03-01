import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/components/**/*.{ts,tsx}',
    './src/app/**/*.{ts,tsx}',
    './src/containers/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      height: {
        'screen-wo-header': 'calc(100vh - 64px)',
      },
      colors: {
        'extra-light-green': '#BED1CF',
        'light-green': '#0D9276',
        'medium-green': '#638889',
        'dark-green': '#074C51',
        'light-yellow': '#FFF7F1',
        'white-yellow': '#F6EBD9',
        'light-red': '#E78895',
        'dark-red': '#C70039',
        'light-blue': '#40A2E3',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
}
export default config
