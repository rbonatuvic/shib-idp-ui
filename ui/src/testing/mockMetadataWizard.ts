import { Wizard } from '../app/wizard/model/wizard';

export interface MockMetadata {
    name: string;
    serviceEnabled: boolean;
    foo: {
        bar: string;
        baz: string;
    };
}

export const MockMetadataWizard: Wizard<MockMetadata> = {
    label: 'Metadata Source',
    type: '@MetadataProvider',
    validatorParams: [],
    bindings: {},
    parser(changes: Partial<MockMetadata>, schema?: any): any {
        return changes;
    },
    formatter(changes: Partial<MockMetadata>, schema?: any): any {
        return changes;
    },
    getValidators(): { [key: string]: any } {
        return {};
    },
    schema: 'api/ui/MetadataSources',
    steps: [
        {
            index: 1,
            id: 'common',
            label: 'label.sp-org-info',
            fields: [
                'name',
                'serviceEnabled'
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
            index: 2,
            id: 'next',
            label: 'something',
            fields: [
                'foo',
                'list'
            ],
            fieldsets: [
                {
                    type: 'group',
                    fields: [
                        'foo'
                    ]
                },
                {
                    type: 'group',
                    fields: [
                        'list'
                    ]
                }
            ]
        }
    ]
};
