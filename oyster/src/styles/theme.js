import { breakpoints } from './breakpoints';
import { materialColors } from './colors';
import { fonts } from './fonts';
import { spacing } from './spacing';

const primary = [
  '#0F0C29',
  '#0F0C29',
  '#0F0C29',
  '#0F0C29',
  '#0F0C29',
  '#0F0C29',
  '#0F0C29',
  '#0F0C29',
  '#0F0C29',
  '#0F0C29',
];

const secondary = [
  '#302B63',
  '#302B63',
  '#302B63',
  '#302B63',
  '#302B63',
  '#302B63',
  '#302B63',
  '#302B63',
  '#302B63',
  '#302B63',
];

const white = '#FFFFFF';

const black = '#222222';

export const grad = 'linear-gradient(to right, #0f0c29, #302b63, #24243e)';

const paletteColors = {
  primary,
  secondary,
  info: materialColors.blue,
  success: materialColors.cyan,
  warning: materialColors.amber,
  error: materialColors.red,
  grey: materialColors.grey,
};

export const lightTheme = {
  globalStyles: (theme) => ({
    body: {
      colorScheme: 'light',
      dateFormat: 'yyyy年MM月dd日',
      datesLocale: 'ja',
      backgroundColor: paletteColors.grey[0],
      white,
      black,
      colors: paletteColors,
      primaryColor: 'primary',
      defaultGradient: {
        from: 'primary',
        to: 'secondary',
        deg: 90,
      },
      fontFamily: fonts.join(', '),
      loader: 'dots',
      breakpoints,
      spacing,
    },
    '.filepond--panel-root': {
      backgroundColor: '#e7f5ff',
    },
    '.filepond--drop-label': {
      color: '#228be6',
      paddingTop: '180px',
    },
  }),
};
