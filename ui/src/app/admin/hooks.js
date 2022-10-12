import useFetch from 'use-http';
import isNil from 'lodash/isNil';
import {isValidRegex} from '../core/utility/is_valid_regex';
import API_BASE_PATH from '../App.constant';

export function useGroups (opts = { cachePolicy: 'no-cache' }) {
    return useFetch(`${API_BASE_PATH}/admin/groups`, opts);
}

export function useGroup(id) {
    return useFetch(`${API_BASE_PATH}/admin/groups/${id}`, {
        cachePolicy: 'no-cache'
    });
}

export function useRoles(opts = { cachePolicy: 'no-cache' }) {
    return useFetch(`${API_BASE_PATH}/admin/roles`, opts);
}

export function useRole(id) {
    return useFetch(`${API_BASE_PATH}/admin/roles/${id}`, {
        cachePolicy: 'no-cache'
    });
}

export function useGroupUiSchema () {
    return {
        description: {
            'ui:widget': 'textarea'
        },
        approversList: {
            'ui:options': {
                'widget': 'MultiSelectWidget',
                'enum': [
                    'Foo',
                    'Bar'
                ]
            }
        }
    };
}

export function useGroupUiValidator() {
    return (formData, errors) => {
        if (!isNil(formData?.validationRegex) && formData?.validationRegex !== '') {
            const isValid = isValidRegex(formData.validationRegex);
            if (!isValid) {
                errors.validationRegex.addError('message.invalid-regex-pattern');
            }
        }
        return errors;
    }
}

export function useRoleUiSchema() {
    return {};
}

export function useConfigurations (opts = { cachePolicy: 'no-cache' }) {
    return useFetch(`${API_BASE_PATH}/`, opts);
}

export function useConfiguration(opts = { cachePolicy: 'no-cache' }) {
    return useFetch(`${API_BASE_PATH}/shib/property/set`, opts);
}

export function useConfigurationUiSchema () {
    return {
        description: {
            'ui:widget': 'textarea'
        }
    };
}

export function useConfigDownload () {
    return useFetch(`${API_BASE_PATH}/shib/property/set`, {
        cachePolicy: 'no-cache'
    });
}
