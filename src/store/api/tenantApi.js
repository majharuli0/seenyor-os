import { api } from './apiSlice';
import { 
  setCurrentTenant, 
  setTenants, 
  addTenant, 
  updateTenant, 
  setTenantConfig,
  setSubscriptionInfo,
  setFeatureFlags 
} from '../slices/tenantSlice';

export const tenantApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getTenants: builder.query({
      query: (params = {}) => ({
        url: '/tenants',
        params,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setTenants(data.tenants || data));
        } catch (error) {
          console.error('Failed to fetch tenants:', error);
        }
      },
      providesTags: ['Tenant'],
    }),
    
    getTenant: builder.query({
      query: (tenantId) => `/tenants/${tenantId}`,
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCurrentTenant(data));
        } catch (error) {
          console.error('Failed to fetch tenant:', error);
        }
      },
      providesTags: (result, error, id) => [{ type: 'Tenant', id }],
    }),
    
    createTenant: builder.mutation({
      query: (tenantData) => ({
        url: '/tenants',
        method: 'POST',
        body: tenantData,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(addTenant(data));
        } catch (error) {
          console.error('Failed to create tenant:', error);
        }
      },
      invalidatesTags: ['Tenant'],
    }),
    
    updateTenant: builder.mutation({
      query: ({ tenantId, ...tenantData }) => ({
        url: `/tenants/${tenantId}`,
        method: 'PUT',
        body: tenantData,
      }),
      async onQueryStarted({ tenantId, ...tenantData }, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(updateTenant({ id: tenantId, ...data }));
        } catch (error) {
          console.error('Failed to update tenant:', error);
        }
      },
      invalidatesTags: (result, error, { tenantId }) => [
        { type: 'Tenant', id: tenantId },
        'Tenant',
      ],
    }),
    
    deleteTenant: builder.mutation({
      query: (tenantId) => ({
        url: `/tenants/${tenantId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Tenant'],
    }),
    
    getTenantConfig: builder.query({
      query: (tenantId) => `/tenants/${tenantId}/config`,
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setTenantConfig(data));
        } catch (error) {
          console.error('Failed to fetch tenant config:', error);
        }
      },
      providesTags: (result, error, id) => [{ type: 'Tenant', id: `${id}-config` }],
    }),
    
    updateTenantConfig: builder.mutation({
      query: ({ tenantId, config }) => ({
        url: `/tenants/${tenantId}/config`,
        method: 'PUT',
        body: config,
      }),
      async onQueryStarted({ tenantId, config }, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setTenantConfig(data));
        } catch (error) {
          console.error('Failed to update tenant config:', error);
        }
      },
      invalidatesTags: (result, error, { tenantId }) => [
        { type: 'Tenant', id: `${tenantId}-config` },
      ],
    }),
    
    getTenantSubscription: builder.query({
      query: (tenantId) => `/tenants/${tenantId}/subscription`,
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setSubscriptionInfo(data));
        } catch (error) {
          console.error('Failed to fetch subscription info:', error);
        }
      },
      providesTags: (result, error, id) => [{ type: 'Subscription', id }],
    }),
    
    updateTenantSubscription: builder.mutation({
      query: ({ tenantId, subscriptionData }) => ({
        url: `/tenants/${tenantId}/subscription`,
        method: 'PUT',
        body: subscriptionData,
      }),
      invalidatesTags: (result, error, { tenantId }) => [
        { type: 'Subscription', id: tenantId },
      ],
    }),
    
    getTenantFeatureFlags: builder.query({
      query: (tenantId) => `/tenants/${tenantId}/features`,
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setFeatureFlags(data));
        } catch (error) {
          console.error('Failed to fetch feature flags:', error);
        }
      },
      providesTags: (result, error, id) => [{ type: 'Tenant', id: `${id}-features` }],
    }),
    
    updateTenantFeatureFlags: builder.mutation({
      query: ({ tenantId, features }) => ({
        url: `/tenants/${tenantId}/features`,
        method: 'PUT',
        body: features,
      }),
      async onQueryStarted({ tenantId, features }, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setFeatureFlags(data));
        } catch (error) {
          console.error('Failed to update feature flags:', error);
        }
      },
      invalidatesTags: (result, error, { tenantId }) => [
        { type: 'Tenant', id: `${tenantId}-features` },
      ],
    }),
    
    getTenantBranding: builder.query({
      query: (tenantId) => `/tenants/${tenantId}/branding`,
      providesTags: (result, error, id) => [{ type: 'Tenant', id: `${id}-branding` }],
    }),
    
    updateTenantBranding: builder.mutation({
      query: ({ tenantId, branding }) => ({
        url: `/tenants/${tenantId}/branding`,
        method: 'PUT',
        body: branding,
      }),
      invalidatesTags: (result, error, { tenantId }) => [
        { type: 'Tenant', id: `${tenantId}-branding` },
      ],
    }),
    
    uploadTenantLogo: builder.mutation({
      query: ({ tenantId, logoFile }) => {
        const formData = new FormData();
        formData.append('logo', logoFile);
        return {
          url: `/tenants/${tenantId}/branding/logo`,
          method: 'POST',
          body: formData,
          formData: true,
        };
      },
      invalidatesTags: (result, error, { tenantId }) => [
        { type: 'Tenant', id: `${tenantId}-branding` },
      ],
    }),
  }),
});

export const {
  useGetTenantsQuery,
  useGetTenantQuery,
  useCreateTenantMutation,
  useUpdateTenantMutation,
  useDeleteTenantMutation,
  useGetTenantConfigQuery,
  useUpdateTenantConfigMutation,
  useGetTenantSubscriptionQuery,
  useUpdateTenantSubscriptionMutation,
  useGetTenantFeatureFlagsQuery,
  useUpdateTenantFeatureFlagsMutation,
  useGetTenantBrandingQuery,
  useUpdateTenantBrandingMutation,
  useUploadTenantLogoMutation,
} = tenantApi;

