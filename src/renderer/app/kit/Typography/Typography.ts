import React, { createElement, PropsWithChildren } from 'react';

import { props, StyleXStyles } from '@stylexjs/stylex';

import { StyledTypography } from './typography.stylex';

type TypographyProps = PropsWithChildren<{
  level: keyof typeof StyledTypography;
  component?: string;
  style?: StyleXStyles;
}>;

export const Typography: React.FC<TypographyProps> = ({
  level,
  children,
  component = 'p',
  style,
}) => {
  return createElement(component, props(StyledTypography[level], style), children);
};
