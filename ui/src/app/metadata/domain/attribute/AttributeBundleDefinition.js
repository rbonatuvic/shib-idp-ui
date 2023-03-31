import { defaultsDeep } from "lodash";
import { BASE_PATH } from '../../../App.constant';

export const AttributeBundleDefinition = {
    label: 'Metadata Attribute Bundle',
    type: '@MetadataAttributeBundle',
    steps: [],
    schema: `${BASE_PATH}assets/schema/attribute/bundle.schema.json`,

    uiSchema: {
        attributes: {
            'ui:widget': 'AttributeReleaseWidget'
        }
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