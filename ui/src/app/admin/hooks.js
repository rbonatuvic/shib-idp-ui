import useFetch from 'use-http';
import API_BASE_PATH from '../App.constant';

export function useGroups (opts = { cachePolicy: 'no-cache' }) {
    return useFetch(`${API_BASE_PATH}/admin/groups`, opts);
}

export function useGroup(id) {
    return useFetch(`${API_BASE_PATH}/admin/groups/${id}`, {
        cachePolicy: 'no-cache'
    });
}

export function useGroupUiSchema () {
    return {
        description: {
            'ui:widget': 'textarea'
        }
    };
}