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
        'dark-green-100': '#064449',
        'dark-green-200': '#063d41',
        'dark-green-300': '#053539',
        'dark-green-400': '#042e31',
        'dark-green-500': '#042629',
        'dark-green-600': '#031e20',
        'dark-green-700': '#021718',
        'dark-green-800': '#010f10',
        'dark-green-900': '#010808',
        'light-green-100': '#205e62',
        'light-green-200': '#397074',
        'light-green-300': '#518285',
        'light-green-400': '#6a9497',
        'light-green-500': '#83a6a8',
        'light-green-600': '#9cb7b9',
        'light-green-700': '#b5c9cb',
        'light-green-800': '#cddbdc',
        'light-green-900': '#e6edee',
        'extra-light-green': '#BED1CF',
        'light-green': '#205e62',
        'grey-green': '#638889',
        'medium-green': '#074C51',
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
