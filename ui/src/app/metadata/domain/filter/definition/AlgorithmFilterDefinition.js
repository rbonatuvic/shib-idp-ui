import defaultsDeep from "lodash/defaultsDeep";
// import API_BASE_PATH from "../../../../App.constant";
import { BASE_PATH } from '../../../../App.constant';
import { BaseFilterDefinition } from "./BaseFilterDefinition";

export const AlgorithmFilterWizard = {
    ...BaseFilterDefinition,
    uiSchema: defaultsDeep({
        algorithmFilterTarget: {
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
    label: 'Algorithm',
    type: 'Algorithm',
    // schema: `${API_BASE_PATH}/ui/AlgorithmFilter`,
    schema: `${BASE_PATH}assets/schema/filter/algorithm.schema.json`,
    steps: [],
    validator: (data = [], current = { resourceId: null }, group) => {
        return BaseFilterDefinition.validator(data, current, group, 'algorithmFilterTarget', 'algorithmFilterTargetType')
    },
    formatter: (changes) => ({
        ...changes,
        '@type': AlgorithmFilterWizard.type
    })
};

export const AlgorithmFilterEditor = {
    ...AlgorithmFilterWizard,
    steps: [
        {
            id: 'common',
            label: 'label.target',
            index: 1,
            fields: [
                'name',
                '@type',
                'resourceId',
                'algorithmFilterTarget',
                'filterEnabled'
            ]
        },
        {
            id: 'options',
            label: 'label.options',
            index: 2,
            initialValues: [],
            fields: []
        }
    ]
};