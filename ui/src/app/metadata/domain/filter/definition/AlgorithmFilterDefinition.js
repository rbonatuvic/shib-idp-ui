import defaultsDeep from "lodash/defaultsDeep";
import API_BASE_PATH from "../../../../App.constant";
import { BaseFilterDefinition } from "./BaseFilterDefinition";

export const AlgorithmFilterWizard = {
    ...BaseFilterDefinition,
    uiSchema: defaultsDeep({
        algorithmFilterTarget: {
            'ui:field': 'FilterTargetField',
            api: ''
        },
        algorithms: {
            "ui:options": {
                orderable: false,
            },
            items: {
                checkOnChange: true
            }
        }
    }, BaseFilterDefinition.uiSchema),
    label: 'Algorithm',
    type: 'Algorithm',
    schema: `${API_BASE_PATH}/ui/AlgorithmFilter`,
    // schema: `${BASE_PATH}assets/schema/filter/algorithm.schema.json`,
    steps: [],
    validator: (data = [], current = { resourceId: null }, group) => {
        const base = BaseFilterDefinition.validator(data, current, group, 'algorithmFilterTarget', 'algorithmFilterTargetType');

        return (formData, errors) => {
            const errorList = base(formData, errors);
            const { algorithms = [] } = formData;

            const dupes = algorithms.filter((item, index) => index !== algorithms.indexOf(item));
            
            if (dupes.length) {
                algorithms.forEach((value, index) => {
                    if (dupes.indexOf(value) > -1) {
                        errors.algorithms[index].addError('message.algorithms-unique');
                    }
                });
            }

            return errorList;
        }
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
            fields: [
                'algorithms'
            ]
        }
    ]
};