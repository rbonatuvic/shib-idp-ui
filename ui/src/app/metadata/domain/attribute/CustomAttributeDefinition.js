import { defaultsDeep } from "lodash";

export const CustomAttributeDefinition = {
    label: 'Metadata Attribute',
    type: '@MetadataAttribute',
    steps: [],
    schema: `/assets/schema/attribute/attribute.schema.json`,

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
            'ui:widget': 'radio'
        },
        persistType: {
            'ui:widget': 'hidden'
        },
        customAttrListDefinitions: {
            'ui:field': 'StringListWithDefaultField',
            'ui:title': 'label.entity-attribute-list-options',
            items: {
                default: {
                    'ui:widget': 'checkbox'
                }
            }
        }
    },

    parser: (data) => {
        if (!data) {
            return data;
        }
        const { attributeType } = data;
        let parsed = { ...data };
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
                defaultValue: data.defaultValueBoolean
            }
        }

        if (attributeType === 'STRING') {
            parsed = {
                ...parsed,
                defaultValue: data.defaultValueString
            }
        }

        return parsed;
    },

    formatter: (changes) => {
        if (!changes) {
            return changes;
        }
        let formatted = { ...changes };
        const { attributeType } = changes;

        if (attributeType === 'SELECTION_LIST') {
            formatted = {
                ...formatted,
                customAttrListDefinitions: formatted.customAttrListDefinitions.map(d => ({
                    value: d,
                    default: d === changes.defaultValue
                }))
            }
        }

        if (attributeType === 'BOOLEAN') {
            formatted = {
                ...formatted,
                defaultValueBoolean: formatted.defaultValue === 'true' ? true : false,
                invert: formatted.invert === 'true' ? true : false
            }
        }

        if (attributeType === 'STRING') {
            formatted = {
                ...formatted,
                defaultValueString: formatted.defaultValue
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