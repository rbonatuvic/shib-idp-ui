import API_BASE_PATH from "../../../App.constant";
import { isValidRegex } from "../../../core/utility/is_valid_regex";

export const NameIDFilterWizard = {
    label: 'NameIDFormat',
    type: 'NameIDFormat',
    schema: `${API_BASE_PATH}/ui/NameIdFormatFilter`,
    steps: [],
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
                    if (error) {
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
                    params: [value]
                } : null;
                return err;
            },
            '/nameIdFormatFilterTarget': (value, property, form) => {
                if (!form || !form.value || !form.value.nameIdFormatFilterTarget ||
                    form.value.nameIdFormatFilterTarget.nameIdFormatFilterTargetType !== 'REGEX') {
                    return null;
                }
                return isValidRegex(value.value[0]) ? null : {
                    code: 'INVALID_REGEX',
                    path: `#${property.path}`,
                    message: 'message.invalid-regex-pattern',
                    params: [value.value[0]]
                };
            }
        };
        return validators;
    },
    parser: (changes) => changes,
    formatter: (changes) => changes
};

export const NameIDFilterEditor = {
    ...NameIDFilterWizard,
    steps: [
        {
            id: 'common',
            label: 'label.target',
            index: 1,
            fields: [
                'name',
                'filterEnabled',
                '@type',
                'resourceId',
                'nameIdFormatFilterTarget'
            ]
        },
        {
            id: 'options',
            label: 'label.options',
            index: 2,
            initialValues: [],
            fields: [
                'removeExistingFormats',
                'formats'
            ]
        }
    ]
};