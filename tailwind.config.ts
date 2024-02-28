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
        'medium-green': '#638889',
        'dark-green': '#074C51',
        'white-yellow': '#F6EBD9',
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
