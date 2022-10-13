import useFetch from 'use-http';
import isNil from 'lodash/isNil';
import {isValidRegex} from '../core/utility/is_valid_regex';
import API_BASE_PATH from '../App.constant';

import set from 'lodash/set';

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

export function useGroupSchema (schema, groups, invalid = []) {
    const filtered = groups.filter(g => !(invalid.indexOf(g.resourceId) > -1));
    const enumList = filtered.map(g => g.resourceId);
    const enumNames = filtered.map(g => g.name);
    let s = { ...schema };
    s = set(s, 'properties.approversList.items.enum', enumList);
    s = set(s, 'properties.approversList.items.enumNames', enumNames);
    return s;
}

export function useGroupUiSchema () {
    return {
        description: {
            'ui:widget': 'textarea'
        },
        approversList: {
            'ui:options': {
                'widget': 'MultiSelectWidget',
            }
        }
    };
}

export function useGroupFormatter () {
    return (group) => ({
        ...group,
        approversList: [
            ...(group?.approversList?.length ? group.approversList[0].approverGroupIds : [] )
        ]
    });
}

export function useGroupParser () {
    return (group = {}) => ({
        ...group,
        approversList: [
            {
                approverGroupIds: [
                    ...group?.approversList
                ]
            }
        ]
    });
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
