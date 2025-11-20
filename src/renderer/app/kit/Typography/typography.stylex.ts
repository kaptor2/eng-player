import * as stylex from '@stylexjs/stylex';

const FONT = '"SF Mono", Monaco, Consolas, "Courier New", monospace';

export const fontSize = stylex.defineVars({
  '2xs': '10px',
  xs: '11px',
  sm: '12px',
  base: '13px',
  md: '14px',
  lg: '16px',
  xl: '18px',
  '2xl': '20px',
  '3xl': '24px',
  '4xl': '32px',
  '5xl': '40px',
  '6xl': '48px',
  '7xl': '56px',
  '8xl': '64px',
});

export const fontWeight = stylex.defineVars({
  thin: '100',
  extralight: '200',
  light: '300',
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
  black: '900',
});

export const lineHeight = stylex.defineVars({
  none: '1',
  tight: '1.2',
  snug: '1.375',
  normal: '1.5',
  relaxed: '1.625',
  loose: '2',
});

export const letterSpacing = stylex.defineVars({
  tighter: '-0.05em',
  tight: '-0.025em',
  normal: '0',
  wide: '0.025em',
  wider: '0.05em',
  widest: '0.1em',
});

export const StyledTypography = stylex.create({
  h1: {
    fontFamily: FONT,
    fontSize: fontSize['6xl'],
    fontWeight: 300,
    letterSpacing: letterSpacing.tight,
    lineHeight: lineHeight.tight,
  },
  h2: {
    fontFamily: FONT,
    fontSize: fontSize['4xl'],
    fontWeight: 400,
    letterSpacing: letterSpacing.tight,
    lineHeight: lineHeight.tight,
  },
  h3: {
    fontFamily: FONT,
    fontSize: fontSize['2xl'],
    fontWeight: 600,
    letterSpacing: letterSpacing.normal,
    lineHeight: lineHeight.snug,
  },
  'body-sm': {
    fontFamily: FONT,
    fontSize: fontSize.sm,
    fontWeight: 400,
    letterSpacing: letterSpacing.normal,
    lineHeight: lineHeight.normal,
  },
  'body-md': {
    fontFamily: FONT,
    fontSize: fontSize.base,
    fontWeight: 400,
    letterSpacing: letterSpacing.normal,
    lineHeight: lineHeight.normal,
  },
  'body-lg': {
    fontFamily: FONT,
    fontSize: fontSize.lg,
    fontWeight: 400,
    letterSpacing: letterSpacing.normal,
    lineHeight: lineHeight.relaxed,
  },
  'title-sm': {
    fontFamily: FONT,
    fontSize: fontSize.sm,
    fontWeight: 600,
    letterSpacing: letterSpacing.normal,
    lineHeight: lineHeight.normal,
  },
  'title-md': {
    fontFamily: FONT,
    fontSize: fontSize.base,
    fontWeight: 600,
    letterSpacing: letterSpacing.normal,
    lineHeight: lineHeight.normal,
  },
  'title-lg': {
    fontFamily: FONT,
    fontSize: fontSize.lg,
    fontWeight: 600,
    letterSpacing: letterSpacing.normal,
    lineHeight: lineHeight.snug,
  },
  caption: {
    fontFamily: FONT,
    fontSize: fontSize.xs,
    fontWeight: 400,
    letterSpacing: letterSpacing.wide,
    lineHeight: lineHeight.normal,
  },
});
