import useFetch from 'use-http';
import API_BASE_PATH from '../App.constant';

export function useGroups () {
    return useFetch(`${API_BASE_PATH}/groups`);
}

export function useGroup() {
    return useFetch(`/group.json`);
}

/*export function useGroup() {
    return useFetch(`${API_BASE_PATH}/group`);
}*/

export function useGroupUiSchema () {
    return {

    };
}