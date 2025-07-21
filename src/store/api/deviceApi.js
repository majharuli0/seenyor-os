import { api } from './apiSlice';

export const deviceApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get all devices with filtering and pagination
    getDevices: builder.query({
      query: ({ 
        page = 1, 
        limit = 10, 
        search = '', 
        status = '', 
        type = '', 
        tenantId = '',
        assignedTo = '' 
      } = {}) => ({
        url: '/devices',
        params: {
          page,
          limit,
          search,
          status,
          type,
          tenantId,
          assignedTo,
        },
      }),
      providesTags: ['Device'],
      transformResponse: (response) => {
        return {
          devices: response.data || response.devices || [],
          total: response.total || response.count || 0,
          page: response.page || 1,
          totalPages: response.totalPages || Math.ceil((response.total || 0) / (response.limit || 10)),
        };
      },
    }),

    // Get single device by ID
    getDevice: builder.query({
      query: (id) => `/devices/${id}`,
      providesTags: (result, error, id) => [{ type: 'Device', id }],
    }),

    // Get device by serial number
    getDeviceBySerial: builder.query({
      query: (serialNumber) => `/devices/serial/${serialNumber}`,
      providesTags: (result, error, serialNumber) => [
        { type: 'Device', id: `serial-${serialNumber}` },
      ],
    }),

    // Register new device
    registerDevice: builder.mutation({
      query: (deviceData) => ({
        url: '/devices',
        method: 'POST',
        body: deviceData,
      }),
      invalidatesTags: ['Device', 'DeviceStats'],
    }),

    // Update device information
    updateDevice: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/devices/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Device', id },
        'Device',
      ],
    }),

    // Delete/Decommission device
    deleteDevice: builder.mutation({
      query: (id) => ({
        url: `/devices/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Device', 'DeviceStats'],
    }),

    // Assign device to user/tenant
    assignDevice: builder.mutation({
      query: ({ deviceId, assignmentData }) => ({
        url: `/devices/${deviceId}/assign`,
        method: 'POST',
        body: assignmentData,
      }),
      invalidatesTags: (result, error, { deviceId }) => [
        { type: 'Device', id: deviceId },
        'Device',
      ],
    }),

    // Unassign device
    unassignDevice: builder.mutation({
      query: (deviceId) => ({
        url: `/devices/${deviceId}/unassign`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, deviceId) => [
        { type: 'Device', id: deviceId },
        'Device',
      ],
    }),

    // Get device statistics
    getDeviceStats: builder.query({
      query: (tenantId) => ({
        url: '/devices/stats',
        params: tenantId ? { tenantId } : {},
      }),
      providesTags: ['DeviceStats'],
    }),

    // Get device health/status
    getDeviceHealth: builder.query({
      query: (deviceId) => `/devices/${deviceId}/health`,
      providesTags: (result, error, deviceId) => [
        { type: 'DeviceHealth', id: deviceId },
      ],
    }),

    // Get device alerts
    getDeviceAlerts: builder.query({
      query: ({ deviceId, page = 1, limit = 10, severity = '' }) => ({
        url: `/devices/${deviceId}/alerts`,
        params: { page, limit, severity },
      }),
      providesTags: (result, error, { deviceId }) => [
        { type: 'DeviceAlerts', id: deviceId },
      ],
    }),

    // Get device data/readings
    getDeviceData: builder.query({
      query: ({ 
        deviceId, 
        startDate, 
        endDate, 
        dataType = '', 
        page = 1, 
        limit = 100 
      }) => ({
        url: `/devices/${deviceId}/data`,
        params: {
          startDate,
          endDate,
          dataType,
          page,
          limit,
        },
      }),
      providesTags: (result, error, { deviceId }) => [
        { type: 'DeviceData', id: deviceId },
      ],
    }),

    // Send command to device
    sendDeviceCommand: builder.mutation({
      query: ({ deviceId, command, parameters = {} }) => ({
        url: `/devices/${deviceId}/command`,
        method: 'POST',
        body: { command, parameters },
      }),
      invalidatesTags: (result, error, { deviceId }) => [
        { type: 'Device', id: deviceId },
        { type: 'DeviceHealth', id: deviceId },
      ],
    }),

    // Update device configuration
    updateDeviceConfig: builder.mutation({
      query: ({ deviceId, config }) => ({
        url: `/devices/${deviceId}/config`,
        method: 'PUT',
        body: config,
      }),
      invalidatesTags: (result, error, { deviceId }) => [
        { type: 'Device', id: deviceId },
      ],
    }),

    // Get device configuration
    getDeviceConfig: builder.query({
      query: (deviceId) => `/devices/${deviceId}/config`,
      providesTags: (result, error, deviceId) => [
        { type: 'DeviceConfig', id: deviceId },
      ],
    }),

    // Bulk device operations
    bulkUpdateDevices: builder.mutation({
      query: ({ deviceIds, updates }) => ({
        url: '/devices/bulk-update',
        method: 'PATCH',
        body: { deviceIds, updates },
      }),
      invalidatesTags: ['Device', 'DeviceStats'],
    }),

    // Bulk assign devices
    bulkAssignDevices: builder.mutation({
      query: ({ deviceIds, assignmentData }) => ({
        url: '/devices/bulk-assign',
        method: 'POST',
        body: { deviceIds, assignmentData },
      }),
      invalidatesTags: ['Device'],
    }),

    // Export devices data
    exportDevices: builder.mutation({
      query: (filters = {}) => ({
        url: '/devices/export',
        method: 'POST',
        body: filters,
        responseHandler: (response) => response.blob(),
      }),
    }),

    // Get device firmware info
    getDeviceFirmware: builder.query({
      query: (deviceId) => `/devices/${deviceId}/firmware`,
      providesTags: (result, error, deviceId) => [
        { type: 'DeviceFirmware', id: deviceId },
      ],
    }),

    // Update device firmware
    updateDeviceFirmware: builder.mutation({
      query: ({ deviceId, firmwareVersion }) => ({
        url: `/devices/${deviceId}/firmware`,
        method: 'PUT',
        body: { firmwareVersion },
      }),
      invalidatesTags: (result, error, { deviceId }) => [
        { type: 'DeviceFirmware', id: deviceId },
        { type: 'Device', id: deviceId },
      ],
    }),

    // Get device location history
    getDeviceLocationHistory: builder.query({
      query: ({ deviceId, startDate, endDate, page = 1, limit = 100 }) => ({
        url: `/devices/${deviceId}/location-history`,
        params: { startDate, endDate, page, limit },
      }),
      providesTags: (result, error, { deviceId }) => [
        { type: 'DeviceLocation', id: deviceId },
      ],
    }),

    // Update device location
    updateDeviceLocation: builder.mutation({
      query: ({ deviceId, location }) => ({
        url: `/devices/${deviceId}/location`,
        method: 'PUT',
        body: location,
      }),
      invalidatesTags: (result, error, { deviceId }) => [
        { type: 'Device', id: deviceId },
        { type: 'DeviceLocation', id: deviceId },
      ],
    }),

    // Get device maintenance schedule
    getDeviceMaintenance: builder.query({
      query: (deviceId) => `/devices/${deviceId}/maintenance`,
      providesTags: (result, error, deviceId) => [
        { type: 'DeviceMaintenance', id: deviceId },
      ],
    }),

    // Schedule device maintenance
    scheduleDeviceMaintenance: builder.mutation({
      query: ({ deviceId, maintenanceData }) => ({
        url: `/devices/${deviceId}/maintenance`,
        method: 'POST',
        body: maintenanceData,
      }),
      invalidatesTags: (result, error, { deviceId }) => [
        { type: 'DeviceMaintenance', id: deviceId },
      ],
    }),
  }),
});

export const {
  useGetDevicesQuery,
  useGetDeviceQuery,
  useGetDeviceBySerialQuery,
  useRegisterDeviceMutation,
  useUpdateDeviceMutation,
  useDeleteDeviceMutation,
  useAssignDeviceMutation,
  useUnassignDeviceMutation,
  useGetDeviceStatsQuery,
  useGetDeviceHealthQuery,
  useGetDeviceAlertsQuery,
  useGetDeviceDataQuery,
  useSendDeviceCommandMutation,
  useUpdateDeviceConfigMutation,
  useGetDeviceConfigQuery,
  useBulkUpdateDevicesMutation,
  useBulkAssignDevicesMutation,
  useExportDevicesMutation,
  useGetDeviceFirmwareQuery,
  useUpdateDeviceFirmwareMutation,
  useGetDeviceLocationHistoryQuery,
  useUpdateDeviceLocationMutation,
  useGetDeviceMaintenanceQuery,
  useScheduleDeviceMaintenanceMutation,
} = deviceApi;

