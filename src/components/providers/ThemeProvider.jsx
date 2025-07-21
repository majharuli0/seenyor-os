import React, { useEffect } from 'react';
import { ThemeProvider as NextThemeProvider } from 'next-themes';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectTheme,
  selectThemeMode,
  selectPrimaryColor,
  selectBrandColors,
  selectBorderRadius,
  selectFontSize,
  setThemeMode
} from '../../store/slices/themeSlice';

const ThemeProvider = ({ children }) => {
  const dispatch = useDispatch();
  const themeState = useSelector(selectTheme);
  const mode = useSelector(selectThemeMode);
  const primaryColor = useSelector(selectPrimaryColor);
  const brandColors = useSelector(selectBrandColors);
  const borderRadius = useSelector(selectBorderRadius);
  const fontSize = useSelector(selectFontSize);

  // Apply custom CSS variables for branding and theming
  useEffect(() => {
    const root = document.documentElement;
    
    // Convert hex to HSL for CSS variables
    const hexToHsl = (hex) => {
      const r = parseInt(hex.slice(1, 3), 16) / 255;
      const g = parseInt(hex.slice(3, 5), 16) / 255;
      const b = parseInt(hex.slice(5, 7), 16) / 255;

      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h, s, l = (max + min) / 2;

      if (max === min) {
        h = s = 0;
      } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
      }

      return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
    };

    // Set primary color
    const [h, s, l] = hexToHsl(primaryColor);
    root.style.setProperty('--primary', `${h} ${s}% ${l}%`);
    root.style.setProperty('--primary-foreground', l > 50 ? '0 0% 0%' : '0 0% 100%');
    
    // Set brand colors to CSS variables
    Object.entries(brandColors).forEach(([key, value]) => {
      const [bh, bs, bl] = hexToHsl(value);
      
      // Map brand color keys to CSS variable names
      const colorMapping = {
        success: '--success',
        warning: '--warning', 
        error: '--destructive',
        secondary: '--secondary'
      };
      
      const cssVar = colorMapping[key];
      if (cssVar) {
        root.style.setProperty(cssVar, `${bh} ${bs}% ${bl}%`);
        root.style.setProperty(`${cssVar}-foreground`, bl > 50 ? '0 0% 0%' : '0 0% 100%');
      }
      
      // Also set brand-specific variables for custom classes
      root.style.setProperty(`--brand-${key}`, `${bh} ${bs}% ${bl}%`);
    });
    
    // Set border radius
    root.style.setProperty('--radius', `${borderRadius / 10}rem`);
    
    // Set font size scale
    const fontSizeScale = {
      small: 0.875,
      medium: 1,
      large: 1.125,
    };
    const scale = fontSizeScale[fontSize];
    root.style.setProperty('--font-size-scale', scale);
    
  }, [primaryColor, brandColors, borderRadius, fontSize]);

  // Detect system theme preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      if (themeState.mode === 'auto') {
        dispatch(setThemeMode(e.matches ? 'dark' : 'light'));
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [dispatch, themeState.mode]);

  return (
    <NextThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      forcedTheme={mode === 'auto' ? undefined : mode}
    >
      {children}
    </NextThemeProvider>
  );
};

export default ThemeProvider;

