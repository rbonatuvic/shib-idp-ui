import API_BASE_PATH from "../../../../App.constant";
import {BaseFilterDefinition} from './BaseFilterDefinition';
import {removeNull} from '../../../../core/utility/remove_null';
import defaultsDeep from "lodash/defaultsDeep";

export const EntityAttributesFilterWizard = {
    ...BaseFilterDefinition,
    label: 'EntityAttributes',
    type: 'EntityAttributes',
    schema: `${API_BASE_PATH}/ui/EntityAttributesFilters`,
    uiSchema: defaultsDeep({
        entityAttributesFilterTarget: {
            'ui:field': 'FilterTargetField',
            api: ''
        },
        attributeRelease: {
            'ui:widget': 'AttributeReleaseWidget'
        },
        relyingPartyOverrides: {
            nameIdFormats: {
                "ui:options": {
                    orderable: false
                },
                items: {
                    'ui:widget': 'OptionWidget'
                }
            },
            authenticationMethods: {
                "ui:options": {
                    orderable: false
                },
                items: {
                    'ui:widget': 'OptionWidget'
                }
            }
        }
    }, BaseFilterDefinition.uiSchema),
    validator: (data = [], current = { resourceId: null }, group) => {
        return BaseFilterDefinition.validator(data, current, group, 'entityAttributesFilterTarget', 'entityAttributesFilterTargetType')
    },
    warnings: (data) => {
        let warnings = {};
        if (!data?.relyingPartyOverrides?.signAssertion && data?.relyingPartyOverrides?.dontSignResponse) {
            // ...(warnings.hasOwnProperty('options') ? warnings['options'] : []),
            warnings = {
                ...warnings,
                'options': [
                    'message.invalid-signing'
                ]
            };
        }
        return warnings;
    },
    parser: (changes) => {
        return {
            ...changes,
            relyingPartyOverrides: removeNull(changes.relyingPartyOverrides)
        };
    },
    formatter: (changes) => ({
        ...changes,
        '@type': EntityAttributesFilterWizard.type
    })
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
                'entityAttributesFilterTarget',
                'filterEnabled'
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