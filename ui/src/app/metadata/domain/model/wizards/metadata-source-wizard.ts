import { Wizard, WizardStep } from '../../../../wizard/model';
import { MetadataResolver } from '../metadata-resolver';

export class MetadataSourceWizard implements Wizard<MetadataResolver> {
    label = 'Metadata Source';
    type = '@MetadataProvider';
    steps: WizardStep[] = [
        {
            index: 1,
            id: 'common',
            label: 'label.resolver-common-attributes',
            schema: '/api/ui/MetadataSources',
            fields: [
                'serviceProviderName',
                'entityId'
            ],
            fieldsets: [
                {
                    type: 'section',
                    fields: [
                        'serviceProviderName',
                        'entityId'
                    ]
                }
            ]
        },
        {
            index: 2,
            id: 'org-info',
            label: 'label.org-info',
            schema: '/api/ui/MetadataSources',
            fields: [
                'organization',
                'contacts'
            ],
            fieldsets: [
                {
                    type: 'group',
                    fields: [
                        'organization'
                    ]
                },
                {
                    type: 'group',
                    fields: [
                        'contacts'
                    ]
                }
            ]
        },
        {
            index: 3,
            id: 'metadata-ui',
            label: 'label.metadata-ui',
            schema: '/api/ui/MetadataSources',
            fields: [
                'mdui'
            ]
        },
        {
            index: 4,
            id: 'descriptor-info',
            label: 'label.descriptor-info',
            schema: '/api/ui/MetadataSources',
            fields: [
                'serviceProviderSsoDescriptor'
            ]
        },
        {
            index: 5,
            id: 'logout-endpoints',
            label: 'label.logout-endpoints',
            schema: '/api/ui/MetadataSources',
            fields: [
                'logoutEndpoints'
            ],
            fieldsets: [
                {
                    type: 'group',
                    fields: [
                        'logoutEndpoints'
                    ]
                }
            ]
        },
        {
            index: 6,
            id: 'key-info',
            label: 'label.key-info',
            schema: '/api/ui/MetadataSources',
            fields: [
                'securityInfo'
            ]
        },
        {
            index: 7,
            id: 'assertion',
            label: 'label.assertion',
            schema: '/api/ui/MetadataSources',
            fields: [
                'assertionConsumerServices'
            ]
        },
        {
            index: 8,
            id: 'relying-party',
            label: 'label.relying-party',
            schema: '/api/ui/MetadataSources',
            fields: [
                'relyingPartyOverrides'
            ]
        },
        {
            index: 9,
            id: 'attribute',
            label: 'label.attribute-release',
            schema: '/api/ui/MetadataSources',
            fields: [
                'attributeRelease'
            ]
        },
        {
            index: 10,
            id: 'finish',
            label: 'label.finished',
            schema: '/api/ui/MetadataSources',
            fields: [
                'serviceEnabled'
            ],
            summary: true
        }
    ];

    parser (changes: Partial<MetadataResolver>, schema?: any): any {
        return changes;
    }

    formatter (changes: Partial < MetadataResolver >, schema ?: any): any {
        return changes;
    }

    getValidators(...args: any[]): { [key: string]: any } {
        const validators = {};
        return validators;
    }
}
