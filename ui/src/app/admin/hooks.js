import useFetch from 'use-http';
import API_BASE_PATH from '../App.constant';

export function useRoles(opts = { cachePolicy: 'no-cache' }) {
    return useFetch(`${API_BASE_PATH}/admin/roles`, opts);
}

export function useRole(id) {
    return useFetch(`${API_BASE_PATH}/admin/roles/${id}`, {
        cachePolicy: 'no-cache'
    });
}

export function useRoleUiSchema() {
    return {
        description: {
            'ui:widget': 'textarea'
        }
    };
}