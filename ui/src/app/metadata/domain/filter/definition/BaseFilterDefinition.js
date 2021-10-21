import { isValidRegex } from '../../../../core/utility/is_valid_regex';

export const BaseFilterDefinition = {
    parser: (changes) => changes,
    formatter: (changes) => changes,
    display: (changes) => changes,
    validator: (data = [], current = { resourceId: null }, group, targetProp, typeProp) => {

        const filters = current ? data.filter(s => s.resourceId !== current.resourceId) : data;
        const names = filters.map(s => s.name);

        return (formData, errors) => {
            if (names.indexOf(formData.name) > -1) {
                errors.name.addError('message.name-unique');
            }

            if (formData.hasOwnProperty(targetProp)) {
                if (formData[targetProp][typeProp] === 'REGEX') {
                    const { [targetProp]: { value } } = formData;
                    const isValid = isValidRegex(value[0]);
                    if (!isValid) {
                        errors[targetProp].value.addError('message.invalid-regex-pattern');
                    }
                }

                if (formData[targetProp][typeProp] === 'CONDITION_SCRIPT') {
                    const { [targetProp]: { value } } = formData;
                    if (!value[0]) {
                        errors[targetProp].value.addError('message.required-for-scripts');
                    }
                }
            }
            
            return errors;
        }
    },
    uiSchema: {
        '@type': {
            'ui:widget': 'hidden'
        },
        'resourceId': {
            'ui:widget': 'hidden'
        }
    }
};
