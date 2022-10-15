import { materialColors } from '../modules/mantine/materialColors';

import { breakpoints } from './breakpoints';
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
  colorScheme: 'light',
  dateFormat: 'yyyy年MM月dd日',
  datesLocale: 'ja',
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
};
