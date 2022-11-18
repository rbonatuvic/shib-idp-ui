import { createApi } from '@reduxjs/toolkit/query/react';
import {getBaseQuery} from '../baseQuery';
import { createNotificationAction } from '../notifications/NotificationSlice';

export const MetadataSourceApi = createApi({
  reducerPath: 'metadataSourceApi',
  tagTypes: ['MetadataSource'],
  baseQuery: getBaseQuery(),
  refetchOnMountOrArgChange: 5,
  endpoints: (builder) => ({
    getSources: builder.query({
      query: () => ({
        url: `/EntityDescriptors`
      }),
      providesTags: ['MetadataSource']
    }),
    selectSource: builder.query({
      query: ({id}) => ({
        url: `/EntityDescriptor/${id}`
      }),
      providesTags: ['MetadataSource']
    }),
    getDisabledSources: builder.query({
      query: () => ({
        url: `/EntityDescriptor/disabledSources`,
      }),
      providesTags: ['MetadataSource']
    }),
    getUnapprovedSources: builder.query({
      query: () => ({
        url: `/EntityDescriptors/needsApproval`
      }),
      providesTags: ['MetadataSource']
    }),
    changeSourceGroup: builder.mutation({
      query: ({source, group}) => ({
        url: `/EntityDescriptor/${source.id}/changeGroup/${group}`,
        method: 'PUT',
        body: {
          ...source,
          idOfOwner: group,
        }
      }),
      invalidatesTags: ['MetadataSource'],
      async onQueryStarted(
        arg,
        { dispatch, queryFulfilled }
      ) {
        const {data: { idOfOwner }} = await queryFulfilled;
        dispatch(createNotificationAction(`Metadata source group updated to: ${idOfOwner}.`))
      },
    }),
    approveSource: builder.mutation({
      query: ({id, approved}) => ({
        url: `/approve/entityDescriptor/${id}/${approved ? 'approve' : 'unapprove'}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['MetadataSource'],
      async onQueryStarted(
        arg,
        { dispatch, queryFulfilled }
      ) {
        const {data: { approved }} = await queryFulfilled;
        dispatch(createNotificationAction(`Metadata source has been ${approved ? 'approved' : 'unapproved'}.`))
      },
    }),
    enableSource: builder.mutation({
      query: ({id, enabled}) => ({
        url: `/activate/entityDescriptor/${id}/${enabled ? 'enable' : 'disable'}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['MetadataSource'],
      async onQueryStarted(
        arg,
        { dispatch, queryFulfilled }
      ) {
        const {data: { serviceEnabled }} = await queryFulfilled;
        dispatch(createNotificationAction(`Metadata source has been ${serviceEnabled ? 'enabled' : 'disabled'}.`))
      },
    }),
    deleteSource: builder.mutation({
      query: ({id}) => ({
        url: `/EntityDescriptor/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['MetadataSource'],
      async onQueryStarted(
        arg,
        { dispatch, queryFulfilled }
      ) {
        await queryFulfilled;
        dispatch(createNotificationAction(`Metadata source has been deleted.`))
      },
    }),
  }),
});

export const {
  useGetSourcesQuery,
  useSelectSourceQuery,
  useLazySelectSourceQuery,
  useGetDisabledSourcesQuery,
  useGetUnapprovedSourcesQuery,
  useChangeSourceGroupMutation,
  useApproveSourceMutation,
  useEnableSourceMutation,
  useDeleteSourceMutation,
} = MetadataSourceApi;
