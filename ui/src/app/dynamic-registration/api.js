import useFetch from 'use-http';

import {API_BASE_PATH, BASE_PATH} from '../App.constant';

export function useDynamicRegistration(id, opts = {}, onMount) {
    //
    return useFetch(`${BASE_PATH}/assets/data/registration.json`, opts, onMount);
}

export function useDynamicRegistrations(opts = {}, onMount) {
    //
    return useFetch(`${BASE_PATH}/assets/data/registrations.json`, opts, onMount);
}

export function useDynamicRegistrationJsonSchema(opts = {}) {
    return useFetch(`${BASE_PATH}/assets/schema/dynamic-registration/oidc.json`, opts, []);
}

export function useDynamicRegistrationUiSchema() {
    return {};
}
export function useDynamicRegistrationValidator() {
    return (formData, errors) => {
        return errors;
    }
}