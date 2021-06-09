import defaultsDeep from "lodash/defaultsDeep";
import API_BASE_PATH from "../../../App.constant";
import { BaseFilterDefinition } from "./BaseFilterDefinition";

import { isValidRegex } from '../../../core/utility/is_valid_regex';

export const NameIDFilterWizard = {
    ...BaseFilterDefinition,
    uiSchema: defaultsDeep({
        nameIdFormatFilterTarget: {
            'ui:field': 'FilterTargetField',
            api: ''
        },
        formats: {
            "ui:options": {
                orderable: false
            },
            items: {
                'ui:widget': 'OptionWidget'
            }
        }
    }, BaseFilterDefinition.uiSchema),
    label: 'NameIDFormat',
    type: 'NameIDFormat',
    schema: `${API_BASE_PATH}/ui/NameIdFormatFilter`,
    steps: [],
    validator: (data = [], current = { resourceId: null }) => {

        const filters = current ? data.filter(s => s.resourceId !== current.resourceId) : data;
        const names = filters.map(s => s.entityId);

        return (formData, errors) => {
            if (names.indexOf(formData.name) > -1) {
                errors.name.addError('message.name-unique');
            }

            if (formData?.nameIdFormatFilterTarget?.nameIdFormatFilterTargetType === 'REGEX') {
                const { nameIdFormatFilterTarget: { value } } = formData;
                const isValid = isValidRegex(value[0]);
                if (!isValid) {
                    errors.nameIdFormatFilterTarget.value.addError('message.invalid-regex-pattern');
                }
            }
            return errors;
        }
    },
    formatter: (changes) => ({
        ...changes,
        '@type': NameIDFilterWizard.type
    })
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