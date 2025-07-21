import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  mode: 'light', // 'light' | 'dark'
  primaryColor: '#1890ff', // Default Ant Design primary color
  brandColors: {
    primary: '#1890ff',
    secondary: '#52c41a',
    accent: '#722ed1',
    success: '#52c41a',
    warning: '#faad14',
    error: '#ff4d4f',
  },
  customBranding: {
    logo: null,
    favicon: null,
    companyName: 'Seenyor OS',
    customCSS: '',
  },
  borderRadius: 6,
  fontSize: 'medium', // 'small' | 'medium' | 'large'
  isCustomTheme: false,
  tenantBranding: null,
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setThemeMode: (state, action) => {
      state.mode = action.payload;
    },
    setPrimaryColor: (state, action) => {
      state.primaryColor = action.payload;
      state.brandColors.primary = action.payload;
      state.isCustomTheme = true;
    },
    setBrandColors: (state, action) => {
      state.brandColors = { ...state.brandColors, ...action.payload };
      state.isCustomTheme = true;
    },
    setCustomBranding: (state, action) => {
      state.customBranding = { ...state.customBranding, ...action.payload };
    },
    setBorderRadius: (state, action) => {
      state.borderRadius = action.payload;
    },
    setFontSize: (state, action) => {
      state.fontSize = action.payload;
    },
    setTenantBranding: (state, action) => {
      state.tenantBranding = action.payload;
      if (action.payload) {
        // Apply tenant branding
        if (action.payload.primaryColor) {
          state.primaryColor = action.payload.primaryColor;
          state.brandColors.primary = action.payload.primaryColor;
        }
        if (action.payload.brandColors) {
          state.brandColors = { ...state.brandColors, ...action.payload.brandColors };
        }
        if (action.payload.customBranding) {
          state.customBranding = { ...state.customBranding, ...action.payload.customBranding };
        }
        state.isCustomTheme = true;
      }
    },
    resetTheme: (state) => {
      return { ...initialState, mode: state.mode };
    },
    toggleTheme: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
    },
  },
});

export const {
  setThemeMode,
  setPrimaryColor,
  setBrandColors,
  setCustomBranding,
  setBorderRadius,
  setFontSize,
  setTenantBranding,
  resetTheme,
  toggleTheme,
} = themeSlice.actions;

// Selectors
export const selectTheme = (state) => state.theme;
export const selectThemeMode = (state) => state.theme.mode;
export const selectPrimaryColor = (state) => state.theme.primaryColor;
export const selectBrandColors = (state) => state.theme.brandColors;
export const selectCustomBranding = (state) => state.theme.customBranding;
export const selectBorderRadius = (state) => state.theme.borderRadius;
export const selectFontSize = (state) => state.theme.fontSize;
export const selectTenantBranding = (state) => state.theme.tenantBranding;
export const selectIsCustomTheme = (state) => state.theme.isCustomTheme;

export default themeSlice.reducer;


