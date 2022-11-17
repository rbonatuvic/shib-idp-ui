import { createApi } from '@reduxjs/toolkit/query/react';
import { getBaseQuery } from '../baseQuery';

export const CurrentUserAdminApi = createApi({
  reducerPath: 'CurrentUserAdminApi',
  tagTypes: ['CurrentUser'],
  baseQuery: getBaseQuery(),
  endpoints: (builder) => ({
    getUser: builder.query({
      query: () => `/admin/users/current`,
      providesTags: ['CurrentUser']
    }),
  }),
})

export const {
  useGetUsersQuery,
  useGetNewUsersQuery,
  useRemoveUserMutation,
  useSetUserGroupRequestMutation,
  useSetUserRoleRequestMutation
} = CurrentUserAdminApi;
