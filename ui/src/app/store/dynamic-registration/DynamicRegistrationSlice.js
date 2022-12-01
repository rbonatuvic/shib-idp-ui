import { createApi } from '@reduxjs/toolkit/query/react';
import getBaseQuery from '../baseQuery';
import { createNotificationAction } from '../notifications/NotificationSlice';

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
      providesTags: ['DynamicRegistration'],
    }),
    selectDynamicRegistration: builder.query({
      query: ({id}) => ({
        url: `/DynamicRegistration/${id}`
      }),
      providesTags: ['DynamicRegistration'],
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
      invalidatesTags: ['DynamicRegistration'],
      async onQueryStarted(
        arg,
        { dispatch, queryFulfilled }
      ) {
        await queryFulfilled;
        dispatch(createNotificationAction(`Dynamic registration deleted.`));
      },
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
      invalidatesTags: ['DynamicRegistration'],
      async onQueryStarted(
        arg,
        { dispatch, queryFulfilled }
      ) {
        const {data: { idOfOwner }} = await queryFulfilled;
        if (idOfOwner) {
          dispatch(createNotificationAction(`Dynamic registration group updated to ${idOfOwner}`))
        }
      },
    }),
    approveDynamicRegistration: builder.mutation({
      query: ({id, approved}) => ({
        url: `/approve/DynamicRegistration/${id}/${approved ? 'approve' : 'unapprove'}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['DynamicRegistration'],
      async onQueryStarted(
        arg,
        { dispatch, queryFulfilled }
      ) {
        const {data: { approved }} = await queryFulfilled;
        dispatch(createNotificationAction(`Dynamic registration ${approved ? 'approved' : 'unapproved'}.`))
      },
    }),
    enableDynamicRegistration: builder.mutation({
      query: ({id, enabled}) => ({
        url: `/activate/DynamicRegistration/${id}/${enabled ? 'enable' : 'disable'}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['DynamicRegistration'],
      async onQueryStarted(
        arg,
        { dispatch, queryFulfilled }
      ) {
        const {data: { enabled }} = await queryFulfilled;
        dispatch(createNotificationAction(`Dynamic registration ${enabled ? 'enabled' : 'disabled'}.`))
      },
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
