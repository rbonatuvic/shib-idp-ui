import API_BASE_PATH from "../../../App.constant";

import {removeNull} from '../../../core/utility/remove_null';
import { isValidRegex } from '../../../core/utility/is_valid_regex';

export const EntityAttributesFilterWizard= {
    label: 'EntityAttributes',
    type: 'EntityAttributes',
    schema: `${API_BASE_PATH}/ui/EntityAttributesFilters`,
    //validatorParams: [getFilterNames],
    getValidators(namesList) {
        const validators = {
            '/': (value, property, form_current) => {
                let errors;
                // iterate all customer
                Object.keys(value).forEach((key) => {
                    const item = value[key];
                    const validatorKey = `/${key}`;
                    const validator = validators.hasOwnProperty(validatorKey) ? validators[validatorKey] : null;
                    const error = validator ? validator(item, { path: `/${key}` }, form_current) : null;
                    if (error && error.invalidate) {
                        errors = errors || [];
                        errors.push(error);
                    }
                });
                return errors;
            },
            '/name': (value, property, form) => {
                const err = namesList.indexOf(value) > -1 ? {
                    code: 'INVALID_NAME',
                    path: `#${property.path}`,
                    message: 'message.name-must-be-unique',
                    params: [value],
                    invalidate: true
                } : null;
                return err;
            },
            '/relyingPartyOverrides': (value, property, form) => {
                if (!value.signAssertion && value.dontSignResponse) {
                    return {
                        code: 'INVALID_SIGNING',
                        path: `#${property.path}`,
                        message: 'message.invalid-signing',
                        params: [value],
                        invalidate: false
                    };
                }
                return null;
            },
            '/entityAttributesFilterTarget': (value, property, form) => {
                if (!form || !form.value || !form.value.entityAttributesFilterTarget ||
                    form.value.entityAttributesFilterTarget.entityAttributesFilterTargetType !== 'REGEX') {
                    return null;
                }
                return isValidRegex(value.value[0]) ? null : {
                    code: 'INVALID_REGEX',
                    path: `#${property.path}`,
                    message: 'message.invalid-regex-pattern',
                    params: [value.value[0]],
                    invalidate: true
                };
            },
        };
        return validators;
    },
    parser: (changes) => {
        return {
            ...changes,
            relyingPartyOverrides: removeNull(changes)
        };
    },
    formatter: (changes) => changes
};


export const EntityAttributesFilterEditor= {
    ...EntityAttributesFilterWizard,
    steps: [
        {
            id: 'common',
            label: 'label.target',
            index: 1,
            fields: [
                'name',
                '@type',
                'resourceId',
                'filterEnabled',
                'entityAttributesFilterTarget'
            ]
        },
        {
            id: 'options',
            label: 'label.options',
            index: 2,
            initialValues: [],
            fields: [
                'relyingPartyOverrides'
            ]
        },
        {
            id: 'attributes',
            label: 'label.attributes',
            index: 3,
            fields: [
                'attributeRelease'
            ]
        }
    ]
};