/**
 * Hook that resolves the Okabe-Ito chart palette from the `--chart-color-*`
 * CSS custom properties declared in src/css/custom.css.
 *
 * Theme-flip mechanism: Docusaurus applies the `data-theme` attribute to
 * `<html>` synchronously inside `setColorMode` BEFORE updating React state
 * (see @docusaurus/theme-common colorMode context). `useColorMode().colorMode`
 * is a dependency of the memo below, so every theme flip re-renders palette
 * consumers, and the render-time `getComputedStyle` read resolves against the
 * already-updated attribute — returning the dark-mode override values from
 * the `[data-theme='dark']` block.
 */

import { useColorMode } from '@docusaurus/theme-common';
import { useMemo } from 'react';

export interface ChartPalette {
 primary: string;
 secondary: string;
 tertiary: string;
 quaternary: string;
 quinary: string;
 senary: string;
 tie: string;
}

/** Light-theme values, used only when `document` is unavailable (SSR). */
const FALLBACK_PALETTE: ChartPalette = {
 primary: '#0072b2',
 secondary: '#d55e00',
 tertiary: '#009e73',
 quaternary: '#e69f00',
 quinary: '#cc79a7',
 senary: '#56b4e9',
 tie: '#888888',
};

function readCustomProperty(styles: CSSStyleDeclaration, name: string, fallback: string): string {
 const value = styles.getPropertyValue(name).trim();
 return value === '' ? fallback : value;
}

/**
 * Resolves the current theme's chart palette from the CSS custom properties
 *
 * @returns the resolved palette, re-read on every color-mode flip
 * @example const palette = useChartPalette();
 * @category Helpers
 * @since 0.7.0
 */
export function useChartPalette(): ChartPalette {
 const { colorMode } = useColorMode();

 return useMemo(() => {
  if (typeof window === 'undefined') return FALLBACK_PALETTE;
  const styles = window.getComputedStyle(document.documentElement);
  return {
   primary: readCustomProperty(styles, '--chart-color-primary', FALLBACK_PALETTE.primary),
   secondary: readCustomProperty(styles, '--chart-color-secondary', FALLBACK_PALETTE.secondary),
   tertiary: readCustomProperty(styles, '--chart-color-tertiary', FALLBACK_PALETTE.tertiary),
   quaternary: readCustomProperty(styles, '--chart-color-quaternary', FALLBACK_PALETTE.quaternary),
   quinary: readCustomProperty(styles, '--chart-color-quinary', FALLBACK_PALETTE.quinary),
   senary: readCustomProperty(styles, '--chart-color-senary', FALLBACK_PALETTE.senary),
   tie: readCustomProperty(styles, '--chart-color-tie', FALLBACK_PALETTE.tie),
  };
 }, [colorMode]);
}
