import { defaultsDeep } from "lodash";
import { BASE_PATH } from "../../../App.constant";

export const CustomAttributeDefinition = {
    label: 'Metadata Attribute',
    type: '@MetadataAttribute',
    steps: [],
    schema: `${BASE_PATH}assets/schema/attribute/attribute.schema.json`,

    uiSchema: {
        layout: {
            groups: [
                {
                    size: 6,
                    classNames: '',
                    fields: [
                        'name',
                        'attributeType',
                        'attributeName',
                        'attributeFriendlyName',
                        'displayName',
                        'helpText'
                    ]
                },
                {
                    size: 6,
                    classNames: 'bg-light border rounded p-4',
                    fields: [
                        'defaultValue',
                        'defaultValueBoolean',
                        'defaultValueString',
                        'customAttrListDefinitions',
                        'persistValue',
                        'persistType',
                        'invert'
                    ]
                }
            ]
        },
        defaultValueBoolean: {
            'ui:widget': 'radio',
            'ui:options': {
                inline: true
            }
        },
        persistType: {
            'ui:widget': 'hidden'
        },
        customAttrListDefinitions: {
            'ui:field': 'StringListWithDefaultField',
            'ui:title': 'label.entity-attribute-list-options'
        }
    },

    parser: (data) => {
        if (!data) {
            return data;
        }
        const { attributeType } = data;
        let { defaultValueBoolean, ...parsed } = data;
        if (attributeType === 'SELECTION_LIST') {
            parsed = {
                ...parsed,
                defaultValue: data.customAttrListDefinitions.find(d => d.default)?.value,
                customAttrListDefinitions: data.customAttrListDefinitions.map(d => d.value)
            }
        }

        if (attributeType === 'BOOLEAN') {
            parsed = {
                ...parsed,
                defaultValue: defaultValueBoolean
            }
        }

        return parsed;
    },

    formatter: (changes) => {
        if (!changes) {
            return changes;
        }
        let { defaultValue, ...formatted } = changes;
        const { attributeType } = changes;

        switch (attributeType) {
            case 'SELECTION_LIST':
                formatted = {
                    ...formatted,
                    customAttrListDefinitions: formatted.customAttrListDefinitions.map(d => ({
                        value: d,
                        default: d === defaultValue
                    }))
                }
                break;
            case 'BOOLEAN':
                formatted = {
                    ...formatted,
                    defaultValueBoolean: defaultValue === 'true' ? true : false,
                    invert: formatted.invert === 'true' ? true : false
                }
                break;
            default:
                formatted = {
                    ...formatted,
                    defaultValue
                }
        }

        return formatted;
    }
}

export const CustomAttributeEditor = {
    ...CustomAttributeDefinition,
    uiSchema: defaultsDeep({
        attributeType: {
            'ui:disabled': true
        }
    }, CustomAttributeDefinition.uiSchema)
};