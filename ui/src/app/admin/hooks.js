import useFetch from 'use-http';
import API_BASE_PATH from '../App.constant';

export function useGroups () {
    return useFetch(`${API_BASE_PATH}/admin/groups`, {
        cachePolicy: 'no-cache'
    });
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