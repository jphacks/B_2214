import { useMediaQuery } from '@mantine/hooks';

export const breakpoints = {
  xs: 0,
  sm: 720,
  md: 960,
  lg: 1280,
  xl: 1920,
};

export const useSmallSize = (theme) =>
  useMediaQuery(`(max-width: ${theme.breakpoints.sm}px)`);

export const useMediumSize = (theme) =>
  useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);