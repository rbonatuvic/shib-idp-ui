import { createApi } from '@reduxjs/toolkit/query/react';
import { getBaseQuery } from '../baseQuery';
import { createNotificationAction } from '../notifications/NotificationSlice';

export const UserAdminApi = createApi({
  reducerPath: 'userAdminApi',
  tagTypes: ['User'],
  baseQuery: getBaseQuery(),
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => `/admin/users`,
      providesTags: ['User']
    }),
    getNewUsers: builder.query({
      query: () => `/admin/users`,
      transformResponse: (response) => response.filter(u => u.role === 'ROLE_NONE'),
      providesTags: ['User']
    }),
    removeUser: builder.mutation({
      // note: an optional `queryFn` may be used in place of `query`
      query: ({ id }) => ({
        url: `/admin/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
      async onQueryStarted(
        arg,
        { dispatch, queryFulfilled }
      ) {
        await queryFulfilled;
        dispatch(createNotificationAction(`User deleted.`))
      },
    }),
    setUserGroupRequest: builder.mutation({
      query: ({user, groupId}) => ({
        url: `/admin/users/${user.username}`,
        method: 'PATCH',
        body: {
          ...user,
          groupId
        }
      }),
      invalidatesTags: ['User'],
      async onQueryStarted(
        arg,
        { dispatch, queryFulfilled }
      ) {
        const { data: {username} } = await queryFulfilled;
        dispatch(createNotificationAction(`User update successful for ${username}.`))
      },
    }),
    setUserRoleRequest: builder.mutation({
      query: ({user, role}) => ({
        url: `/admin/users/${user.username}`,
        method: 'PATCH',
        body: {
          ...user,
          role
        }
      }),
      invalidatesTags: ['User'],
      async onQueryStarted(
        arg,
        { dispatch, queryFulfilled }
      ) {
        const { data: {username} } = await queryFulfilled;
        dispatch(createNotificationAction(`User update successful for ${username}.`))
      },
    })
  }),
})

export const {
  useGetUsersQuery,
  useGetNewUsersQuery,
  useRemoveUserMutation,
  useSetUserGroupRequestMutation,
  useSetUserRoleRequestMutation
} = UserAdminApi;

// 