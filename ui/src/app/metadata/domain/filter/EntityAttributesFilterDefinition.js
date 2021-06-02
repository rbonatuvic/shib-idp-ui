import API_BASE_PATH from "../../../App.constant";
import {BaseFilterDefinition} from './BaseFilterDefinition';
import {removeNull} from '../../../core/utility/remove_null';
import { isValidRegex } from '../../../core/utility/is_valid_regex';
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
    validator: (data = [], current = { resourceId: null }) => {

        const filters = current ? data.filter(s => s.resourceId !== current.resourceId) : data;
        const names = filters.map(s => s.name);

        return (formData, errors) => {
            if (names.indexOf(formData.name) > -1) {
                errors.name.addError('message.name-unique');
            }

            if (formData?.entityAttributesFilterTarget?.entityAttributesFilterTargetType === 'REGEX') {
                const { entityAttributesFilterTarget: {value} } = formData;
                const isValid = isValidRegex(value[0]);
                if (!isValid) {
                    errors.entityAttributesFilterTarget.value.addError('message.invalid-regex-pattern');
                }
            }
            return errors;
        }
    },
    warnings: (data) => {
        let warnings = {};
        if (!data?.relyingPartyOverrides?.signAssertion && data?.relyingPartyOverrides?.dontSignResponse) {
            warnings = {
                ...warnings,
                'options': [
                    ...(warnings.hasOwnProperty('options') ? warnings['options'] : []),
                    'message.invalid-signing'
                ]
            };
        }
        return warnings;
    },
    parser: (changes) => {
        return {
            ...changes,
            relyingPartyOverrides: removeNull(changes)
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