import { Wizard } from '../../../wizard/model';
import { FileSystemMetadataProvider } from '../../domain/model/providers/file-system-metadata-provider';
import { BaseMetadataProviderEditor } from './base.provider.form';

export const FileSystemMetadataProviderWizard: Wizard<FileSystemMetadataProvider> = {
    ...BaseMetadataProviderEditor,
    label: 'FilesystemMetadataProvider',
    type: 'FilesystemMetadataResolver',
    schema: '/api/ui/MetadataResolver/FilesystemMetadataResolver',
    steps: [
        {
            id: 'common',
            label: 'label.common-attributes',
            index: 2,
            initialValues: [],
            fields: [
                'xmlId',
                'metadataFile',
                'doInitialization'
            ],
            fieldsets: [
                {
                    type: 'group-lg',
                    class: ['col-12'],
                    fields: [
                        'xmlId',
                        'metadataFile',
                        'doInitialization'
                    ]
                }
            ]
        },
        {
            id: 'dynamic',
            label: 'label.dynamic-attributes',
            index: 3,
            initialValues: [],
            fields: [
                'reloadableMetadataResolverAttributes'
            ],
            fieldsets: [
                {
                    type: 'group-lg',
                    class: ['col-12'],
                    fields: [
                        'reloadableMetadataResolverAttributes'
                    ]
                }
            ]
        },
        {
            id: 'summary',
            label: 'label.finished',
            index: 4,
            initialValues: [],
            fields: [
                'enabled'
            ],
            fieldsets: [
                {
                    type: 'group-lg',
                    class: ['col-12'],
                    fields: [
                        'enabled'
                    ]
                }
            ]
        }
    ]
};


export const FileSystemMetadataProviderEditor: Wizard<FileSystemMetadataProvider> = {
    ...FileSystemMetadataProviderWizard,
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
                'metadataFile',
                'enabled',
                'doInitialization'
            ],
            override: {
                '@type': {
                    type: 'string',
                    readOnly: true,
                    widget: 'string',
                    oneOf: [{ enum: ['FilesystemMetadataResolver'], description: 'value.file-system-metadata-provider'}]
                }
            },
            fieldsets: [
                {
                    type: 'section',
                    class: ['mb-3'],
                    fields: [
                        'name',
                        '@type'
                    ]
                },
                {
                    type: 'group-lg',
                    class: ['col-12'],
                    fields: [
                        'enabled',
                        'xmlId',
                        'metadataFile',
                        'doInitialization'
                    ]
                }
            ]
        },
        {
            id: 'dynamic',
            label: 'label.dynamic-attributes',
            index: 2,
            initialValues: [],
            fields: [
                'reloadableMetadataResolverAttributes'
            ],
            fieldsets: [
                {
                    type: 'group-lg',
                    class: ['col-12'],
                    fields: [
                        'reloadableMetadataResolverAttributes'
                    ]
                }
            ]
        }
    ]
};
