import { createApi } from '@reduxjs/toolkit/query/react';
import {getBaseQuery} from '../baseQuery';

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
      invalidatesTags: ['MetadataSource']
    }),
    approveSource: builder.mutation({
      query: ({id, approved}) => ({
        url: `/approve/entityDescriptor/${id}/${approved ? 'approve' : 'unapprove'}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['MetadataSource']
    }),
    enableSource: builder.mutation({
      query: ({id, enabled}) => ({
        url: `/activate/entityDescriptor/${id}/${enabled ? 'enable' : 'disable'}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['MetadataSource']
    }),
    deleteSource: builder.mutation({
      query: ({id}) => ({
        url: `/EntityDescriptor/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['MetadataSource']
    }),
  }),
});

export const {
  useGetSourcesQuery,
  useGetDisabledSourcesQuery,
  useGetUnapprovedSourcesQuery,
  useChangeSourceGroupMutation,
  useApproveSourceMutation,
  useEnableSourceMutation,
  useDeleteSourceMutation,
} = MetadataSourceApi;
