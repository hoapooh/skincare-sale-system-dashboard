import {
  createSystem,
  defaultConfig,
  defineConfig,
  defineRecipe,
} from '@chakra-ui/react';

const buttonRecipe = defineRecipe({
  variants: {
    raised: {
      true: {
        bg: 'brand.100',
        color: 'white',
        _hover: {
          bg: 'brand.50',
        },
      },
    },
  },
});
const customConfig = defineConfig({
  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: '#fefbf4' },
          100: { value: '#ede0cc' },
          200: { value: '#d9c4a6' },
          300: { value: '#c4a880' },
          400: { value: '#b08c5a' },
          500: { value: '#9c7034' },
          600: { value: '#7d5a2a' },
          700: { value: '#5e431f' },
          800: { value: '#3f2d15' },
          900: { value: '#20160a' },
        },
      },
      fonts: {
        heading: { value: "'Merriweather', serif" },
        body: { value: "'Merriweather', serif" },
      },
      sizes: {
        navbarHeight: { value: '180px' },
      },
    },
    recipes: {
      button: buttonRecipe,
    },
  },
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
});

const theme = createSystem(defaultConfig, customConfig);

export default theme;
