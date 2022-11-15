import defaultsDeep from 'lodash/defaultsDeep';
import API_BASE_PATH from "../../../../App.constant";
import { BaseProviderDefinition } from "./BaseProviderDefinition";

export const ExternalMetadataProviderWizard = {
    ...BaseProviderDefinition,
    label: 'ExternalMetadataProvider',
    type: 'ExternalMetadataResolver',
    // schema: 'assets/schema/provider/external.schema.json',
    schema: `${API_BASE_PATH}/ui/MetadataResolver/ExternalMetadataResolver`,
    steps: [
        ...BaseProviderDefinition.steps,
        {
            id: 'common',
            label: 'label.common-attributes',
            index: 2,
            initialValues: [],
            fields: [
                'xmlId',
                'metadataFile',
                'description'
            ]
        },
        {
            id: 'summary',
            label: 'label.finished',
            index: 2,
            initialValues: [],
            fields: [
                'enabled',
            ]
        },
    ],
    uiSchema: defaultsDeep({
        layout: {
            groups: [
                {
                    sizes: {
                        xs: 12,
                        lg: 8,
                        xxl: 6
                    },
                    classNames: 'bg-light border rounded px-4 pt-4 pb-3 mb-4',
                    fields: [
                        'name',
                        '@type'
                    ]
                },
                {
                    sizes: {
                        xs: 12,
                        lg: 8,
                        xxl: 6
                    },
                    fields: [
                        'xmlId',
                        'description',
                    ]
                }
            ]
        },
        description: {
            'ui:widget': 'textarea'
        }
    }, BaseProviderDefinition.uiSchema)
};


export const ExternalMetadataProviderEditor = {
    ...ExternalMetadataProviderWizard,
    steps: [
        {
            id: 'common',
            label: 'label.common-attributes',
            index: 1,
            initialValues: [],
            fields: [
                'name',
                'xmlId',
                '@type',
                'description',
                'enabled'
            ],
            override: {
                '@type': {
                    type: 'string',
                    readOnly: true,
                    widget: 'string',
                    oneOf: [{ enum: ['ExternalMetadataResolver'],
                    description: 'value.file-system-metadata-provider' }]
                }
            }
        }
    ],
    uiSchema: defaultsDeep({
        '@type': {
            'ui:readonly': true
        }
    }, ExternalMetadataProviderWizard.uiSchema)
};
