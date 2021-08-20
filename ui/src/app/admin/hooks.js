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

export function useGroupUiSchema () {
    return {
        description: {
            'ui:widget': 'textarea'
        }
    };
}

export function useGroupUiValidator() {
    return (formData, errors) => {
        if (!isNil(formData?.validationRegex)) {
            const isValid = isValidRegex(formData.validationRegex);
            if (!isValid) {
                errors.validationRegex.addError('message.invalid-regex-pattern');
            }
        }
        return errors;
    }
}