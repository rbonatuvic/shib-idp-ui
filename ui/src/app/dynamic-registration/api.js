import useFetch from 'use-http';

import {API_BASE_PATH} from '../App.constant';
import DynamicConfigurationDefinition from './hoc/DynamicConfigurationDefinition';

export const DYNAMIC_REGISTRATION_JSONSCHEMA_PATH = DynamicConfigurationDefinition.schema;


export function useDynamicRegistration(id, opts = {}, onMount) {
    //
    return useFetch(`${API_BASE_PATH}/DynamicRegistration`, opts, onMount);
}

export function useDynamicRegistrations(opts = {}, onMount) {
    //
    return useFetch(`${API_BASE_PATH}/DynamicRegistrations`, opts, onMount);
}

export function useDynamicRegistrationJsonSchema(opts = {}) {
    return useFetch(DYNAMIC_REGISTRATION_JSONSCHEMA_PATH, opts, []);
}

export function useDynamicRegistrationUiSchema() {
    return DynamicConfigurationDefinition.uiSchema;
}
