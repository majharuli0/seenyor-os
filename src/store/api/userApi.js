import { api } from './apiSlice';
import { setUser, setUsers, addUser, updateUser as updateUserState } from '../slices/authSlice';

export const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get all users with filtering and pagination
    getUsers: builder.query({
      query: ({ page = 1, limit = 10, search = '', role = '', tenantId = '' } = {}) => ({
        url: '/users',
        params: {
          page,
          limit,
          search,
          role,
          tenantId,
        },
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUsers(data.users || data));
        } catch (error) {
          console.error('Failed to fetch users:', error);
        }
      },
      providesTags: ['User'],
      transformResponse: (response) => {
        return {
          users: response.data || response.users || [],
          total: response.total || response.count || 0,
          page: response.page || 1,
          totalPages: response.totalPages || Math.ceil((response.total || 0) / (response.limit || 10)),
        };
      },
    }),

    // Get single user by ID
    getUser: builder.query({
      query: (id) => `/users/${id}`,
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),

    // Get current user profile
    getCurrentUser: builder.query({
      query: () => '/users/me',
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data));
        } catch (error) {
          console.error('Failed to fetch current user:', error);
        }
      },
      providesTags: ['CurrentUser'],
    }),

    // Create new user
    createUser: builder.mutation({
      query: (newUser) => ({
        url: '/users',
        method: 'POST',
        body: newUser,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(addUser(data));
        } catch (error) {
          console.error('Failed to create user:', error);
        }
      },
      invalidatesTags: ['User'],
    }),

    // Update existing user
    updateUser: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/users/${id}`,
        method: 'PUT',
        body: patch,
      }),
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(updateUserState({ id, ...data }));
        } catch (error) {
          console.error('Failed to update user:', error);
        }
      },
      invalidatesTags: (result, error, { id }) => [
        { type: 'User', id },
        'User',
        'CurrentUser',
      ],
    }),

    // Update current user profile
    updateProfile: builder.mutation({
      query: (profileData) => ({
        url: '/users/me',
        method: 'PUT',
        body: profileData,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data));
        } catch (error) {
          console.error('Failed to update profile:', error);
        }
      },
      invalidatesTags: ['CurrentUser'],
    }),

    // Delete user
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),

    // Change user password
    changePassword: builder.mutation({
      query: ({ currentPassword, newPassword }) => ({
        url: '/users/me/password',
        method: 'PUT',
        body: { currentPassword, newPassword },
      }),
    }),

    // Reset user password (admin only)
    resetUserPassword: builder.mutation({
      query: ({ userId, newPassword }) => ({
        url: `/users/${userId}/password/reset`,
        method: 'POST',
        body: { newPassword },
      }),
      invalidatesTags: (result, error, { userId }) => [
        { type: 'User', id: userId },
      ],
    }),

    // Activate/Deactivate user
    toggleUserStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/users/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'User', id },
        'User',
      ],
    }),

    // Assign role to user
    assignUserRole: builder.mutation({
      query: ({ userId, role, tenantId }) => ({
        url: `/users/${userId}/role`,
        method: 'PUT',
        body: { role, tenantId },
      }),
      invalidatesTags: (result, error, { userId }) => [
        { type: 'User', id: userId },
        'User',
      ],
    }),

    // Get user permissions
    getUserPermissions: builder.query({
      query: (userId) => `/users/${userId}/permissions`,
      providesTags: (result, error, userId) => [
        { type: 'UserPermissions', id: userId },
      ],
    }),

    // Update user permissions
    updateUserPermissions: builder.mutation({
      query: ({ userId, permissions }) => ({
        url: `/users/${userId}/permissions`,
        method: 'PUT',
        body: { permissions },
      }),
      invalidatesTags: (result, error, { userId }) => [
        { type: 'UserPermissions', id: userId },
        { type: 'User', id: userId },
      ],
    }),

    // Upload user avatar
    uploadAvatar: builder.mutation({
      query: (avatarFile) => {
        const formData = new FormData();
        formData.append('avatar', avatarFile);
        return {
          url: '/users/me/avatar',
          method: 'POST',
          body: formData,
          formData: true,
        };
      },
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data));
        } catch (error) {
          console.error('Failed to upload avatar:', error);
        }
      },
      invalidatesTags: ['CurrentUser'],
    }),

    // Get user activity log
    getUserActivity: builder.query({
      query: ({ userId, page = 1, limit = 20 }) => ({
        url: `/users/${userId}/activity`,
        params: { page, limit },
      }),
      providesTags: (result, error, { userId }) => [
        { type: 'UserActivity', id: userId },
      ],
    }),

    // Bulk user operations
    bulkUpdateUsers: builder.mutation({
      query: ({ userIds, updates }) => ({
        url: '/users/bulk-update',
        method: 'PATCH',
        body: { userIds, updates },
      }),
      invalidatesTags: ['User'],
    }),

    // Export users data
    exportUsers: builder.mutation({
      query: (filters = {}) => ({
        url: '/users/export',
        method: 'POST',
        body: filters,
        responseHandler: (response) => response.blob(),
      }),
    }),

    // Send invitation to new user
    inviteUser: builder.mutation({
      query: (invitationData) => ({
        url: '/users/invite',
        method: 'POST',
        body: invitationData,
      }),
      invalidatesTags: ['User'],
    }),

    // Resend user invitation
    resendInvitation: builder.mutation({
      query: (userId) => ({
        url: `/users/${userId}/invite/resend`,
        method: 'POST',
      }),
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserQuery,
  useGetCurrentUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useUpdateProfileMutation,
  useDeleteUserMutation,
  useChangePasswordMutation,
  useResetUserPasswordMutation,
  useToggleUserStatusMutation,
  useAssignUserRoleMutation,
  useGetUserPermissionsQuery,
  useUpdateUserPermissionsMutation,
  useUploadAvatarMutation,
  useGetUserActivityQuery,
  useBulkUpdateUsersMutation,
  useExportUsersMutation,
  useInviteUserMutation,
  useResendInvitationMutation,
} = userApi;

