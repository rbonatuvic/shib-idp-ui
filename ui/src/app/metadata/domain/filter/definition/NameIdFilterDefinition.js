import defaultsDeep from "lodash/defaultsDeep";
import API_BASE_PATH from "../../../../App.constant";
import { BaseFilterDefinition } from "./BaseFilterDefinition";

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
    validator: (data = [], current = { resourceId: null }, group) => {
        return BaseFilterDefinition.validator(data, current, group, 'nameIdFormatFilterTarget', 'nameIdFormatFilterTargetType')
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
                '@type',
                'resourceId',
                'nameIdFormatFilterTarget',
                'filterEnabled'
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