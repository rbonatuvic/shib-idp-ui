import { Wizard, WizardStep } from '../../../../wizard/model';
import { MetadataResolver } from '../metadata-resolver';
import { MetadataSourceBase } from './metadata-source-base';

export class MetadataSourceWizard extends MetadataSourceBase implements Wizard<MetadataResolver> {
    steps: WizardStep[] = [
        {
            index: 1,
            id: 'common',
            label: 'label.name-and-entity-id',
            schema: 'assets/schema/source/metadata-source.json',
            fields: [
                'serviceProviderName',
                'entityId'
            ],
            fieldsets: [
                {
                    type: 'section',
                    class: ['col-6'],
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
            schema: 'assets/schema/source/metadata-source.json',
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
            schema: 'assets/schema/source/metadata-source.json',
            fields: [
                'mdui'
            ]
        },
        {
            index: 4,
            id: 'descriptor-info',
            label: 'label.descriptor-info',
            schema: 'assets/schema/source/metadata-source.json',
            fields: [
                'serviceProviderSsoDescriptor'
            ]
        },
        {
            index: 5,
            id: 'logout-endpoints',
            label: 'label.logout-endpoints',
            schema: 'assets/schema/source/metadata-source.json',
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
            schema: 'assets/schema/source/metadata-source.json',
            fields: [
                'securityInfo'
            ]
        },
        {
            index: 7,
            id: 'assertion',
            label: 'label.assertion',
            schema: 'assets/schema/source/metadata-source.json',
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
            schema: 'assets/schema/source/metadata-source.json',
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
            schema: 'assets/schema/source/metadata-source.json',
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
        },
        {
            index: 10,
            id: 'summary',
            label: 'label.finished',
            schema: 'assets/schema/source/metadata-source.json',
            fields: [
                'serviceEnabled'
            ],
            summary: true
        }
    ];
}

