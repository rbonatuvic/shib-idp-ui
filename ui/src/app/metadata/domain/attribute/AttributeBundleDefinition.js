import { defaultsDeep } from "lodash";

export const AttributeBundleDefinition = {
    label: 'Metadata Attribute Bundle',
    type: '@MetadataAttributeBundle',
    steps: [],
    schema: `/assets/schema/attribute/bundle.schema.json`,

    uiSchema: {
        
    },

    parser: (data) => {
        return data;
    },

    formatter: (changes) => {
        return changes;
    }
}

export const CustomAttributeEditor = {
    ...AttributeBundleDefinition,
    uiSchema: defaultsDeep({
        attributeType: {
            'ui:disabled': true
        }
    }, AttributeBundleDefinition.uiSchema)
};