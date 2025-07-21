import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentTenant: null,
  tenants: [],
  tenantConfig: null,
  subscriptionInfo: null,
  featureFlags: {},
  dashboardConfig: null,
  isLoading: false,
  error: null,
};

const tenantSlice = createSlice({
  name: 'tenant',
  initialState,
  reducers: {
    setCurrentTenant: (state, action) => {
      state.currentTenant = action.payload;
    },
    setTenants: (state, action) => {
      state.tenants = action.payload;
    },
    addTenant: (state, action) => {
      state.tenants.push(action.payload);
    },
    updateTenant: (state, action) => {
      const index = state.tenants.findIndex(tenant => tenant.id === action.payload.id);
      if (index !== -1) {
        state.tenants[index] = { ...state.tenants[index], ...action.payload };
      }
      if (state.currentTenant && state.currentTenant.id === action.payload.id) {
        state.currentTenant = { ...state.currentTenant, ...action.payload };
      }
    },
    removeTenant: (state, action) => {
      state.tenants = state.tenants.filter(tenant => tenant.id !== action.payload);
      if (state.currentTenant && state.currentTenant.id === action.payload) {
        state.currentTenant = null;
      }
    },
    setTenantConfig: (state, action) => {
      state.tenantConfig = action.payload;
    },
    updateTenantConfig: (state, action) => {
      state.tenantConfig = { ...state.tenantConfig, ...action.payload };
    },
    setSubscriptionInfo: (state, action) => {
      state.subscriptionInfo = action.payload;
    },
    setFeatureFlags: (state, action) => {
      state.featureFlags = action.payload;
    },
    updateFeatureFlag: (state, action) => {
      const { flag, value } = action.payload;
      state.featureFlags[flag] = value;
    },
    setDashboardConfig: (state, action) => {
      state.dashboardConfig = action.payload;
    },
    updateDashboardConfig: (state, action) => {
      state.dashboardConfig = { ...state.dashboardConfig, ...action.payload };
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetTenantState: (state) => {
      return initialState;
    },
  },
});

export const {
  setCurrentTenant,
  setTenants,
  addTenant,
  updateTenant,
  removeTenant,
  setTenantConfig,
  updateTenantConfig,
  setSubscriptionInfo,
  setFeatureFlags,
  updateFeatureFlag,
  setDashboardConfig,
  updateDashboardConfig,
  setLoading,
  setError,
  clearError,
  resetTenantState,
} = tenantSlice.actions;

// Selectors
export const selectCurrentTenant = (state) => state.tenant.currentTenant;
export const selectTenants = (state) => state.tenant.tenants;
export const selectTenantConfig = (state) => state.tenant.tenantConfig;
export const selectSubscriptionInfo = (state) => state.tenant.subscriptionInfo;
export const selectFeatureFlags = (state) => state.tenant.featureFlags;
export const selectDashboardConfig = (state) => state.tenant.dashboardConfig;
export const selectTenantLoading = (state) => state.tenant.isLoading;
export const selectTenantError = (state) => state.tenant.error;

// Feature flag selector
export const selectFeatureFlag = (flag) => (state) => state.tenant.featureFlags[flag] || false;

// Tenant type selectors
export const selectTenantType = (state) => state.tenant.currentTenant?.type;
export const selectIsDistributor = (state) => state.tenant.currentTenant?.type === 'distributor';
export const selectIsReseller = (state) => state.tenant.currentTenant?.type === 'reseller';
export const selectIsEndUser = (state) => state.tenant.currentTenant?.type === 'end_user';

export default tenantSlice.reducer;

