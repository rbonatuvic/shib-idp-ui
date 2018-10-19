import { Wizard, WizardStep } from '../../../../wizard/model';
import { MetadataResolver } from '../metadata-resolver';
import { MetadataSourceBase } from './metadata-source-base';

export class MetadataSourceEditor extends  MetadataSourceBase implements Wizard<MetadataResolver> {
    steps: WizardStep[] = [
        {
            index: 1,
            id: 'common',
            label: 'label.sp-org-info',
            schema: '/api/ui/MetadataSources',
            fields: [
                'serviceProviderName',
                'entityId',
                'serviceEnabled',
                'organization',
                'contacts'
            ],
            fieldsets: [
                {
                    type: 'group',
                    fields: [
                        'serviceProviderName',
                        'entityId',
                        'serviceEnabled',
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
            ],
            fieldsets: [
                {
                    type: 'group',
                    fields: [
                        'assertionConsumerServices'
                    ]
                }
            ]
        },
        {
            index: 8,
            id: 'relying-party',
            label: 'label.relying-party',
            schema: '/api/ui/MetadataSources',
            fields: [
                'relyingPartyOverrides'
            ],
            fieldsets: [
                {
                    type: 'group',
                    fields: [
                        'relyingPartyOverrides'
                    ]
                }
            ]
        },
        {
            index: 9,
            id: 'attribute',
            label: 'label.attribute-release',
            schema: '/api/ui/MetadataSources',
            fields: [
                'attributeRelease'
            ],
            fieldsets: [
                {
                    type: 'group',
                    fields: [
                        'attributeRelease'
                    ]
                }
            ]
        }
    ];
}
