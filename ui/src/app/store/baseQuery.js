import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import API_BASE_PATH from '../App.constant';
import { get_cookie } from '../core/utility/get_cookie';

export const getBaseQuery = (config = {}) => fetchBaseQuery({
    baseUrl: `/${API_BASE_PATH}`,
    prepareHeaders: (headers) => {
        const token = get_cookie('XSRF-TOKEN');

        // If we have a token set in state, let's assume that we should be passing it.
        if (token) {
          headers.set('X-XSRF-TOKEN', token)
        }

        return headers;
    },
    ...config
});

export default getBaseQuery;