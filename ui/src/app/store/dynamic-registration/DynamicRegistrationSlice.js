import { createApi } from '@reduxjs/toolkit/query/react';
import getBaseQuery from '../baseQuery';

export const DynamicRegistrationApi = createApi({
  reducerPath: 'dynamicRegistrationApi',
  tagTypes: ['DynamicRegistration'],
  baseQuery: getBaseQuery(),
  refetchOnMountOrArgChange: 5,
  endpoints: (builder) => ({
    getDynamicRegistrations: builder.query({
      query: () => ({
        url: `/DynamicRegistrations`
      }),
      providesTags: ['DynamicRegistration']
    }),
    selectDynamicRegistration: builder.query({
      query: ({id}) => ({
        url: `/DynamicRegistration/${id}`
      }),
      providesTags: ['DynamicRegistration']
    }),
    getDisabledRegistrations: builder.query({
      query: () => ({
        url: `/DynamicRegistrations/disabledSources`
      }),
      providesTags: ['DynamicRegistration']
    }),
    getUnapprovedRegistrations: builder.query({
      query: () => ({
        url: `/DynamicRegistrations/needsApproval`
      }),
      providesTags: ['DynamicRegistration']
    }),
    updateDynamicRegistration: builder.mutation({
      query: ({id, registration}) => ({
        url: `/DynamicRegistration/${id}`,
        method: 'PUT',
        body: registration
      }),
      invalidatesTags: ['DynamicRegistration']
    }),
    deleteDynamicRegistration: builder.mutation({
      query: ({id}) => ({
        url: `/DynamicRegistration/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['DynamicRegistration']
    }),
    createDynamicRegistration: builder.mutation({
      query: ({registration}) => ({
        url: `/DynamicRegistration`,
        method: 'POST',
        body: registration
      }),
      invalidatesTags: ['DynamicRegistration']
    }),
    changeDynamicRegistrationGroup: builder.mutation({
      query: ({registration, group}) => ({
        url: `/DynamicRegistration/${registration.resourceId}/changeGroup/${group}`,
        method: 'PUT',
        body: {
          ...registration,
          idOfOwner: group,
        }
      }),
      invalidatesTags: ['DynamicRegistration']
    }),
    approveDynamicRegistration: builder.mutation({
      query: ({id, approved}) => ({
        url: `/approve/DynamicRegistration/${id}/${approved ? 'approve' : 'unapprove'}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['DynamicRegistration']
    }),
    enableDynamicRegistration: builder.mutation({
      query: ({id, enabled}) => ({
        url: `/activate/DynamicRegistration/${id}/${enabled ? 'enable' : 'disable'}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['DynamicRegistration']
    }),
  }),
});

export const {
    useGetDynamicRegistrationsQuery,
    useSelectDynamicRegistrationQuery,
    useGetDisabledRegistrationsQuery,
    useGetUnapprovedRegistrationsQuery,
    useEnableDynamicRegistrationMutation,
    useApproveDynamicRegistrationMutation,
    useChangeDynamicRegistrationGroupMutation,
    useCreateDynamicRegistrationMutation,
    useDeleteDynamicRegistrationMutation,
    useUpdateDynamicRegistrationMutation
} = DynamicRegistrationApi;
