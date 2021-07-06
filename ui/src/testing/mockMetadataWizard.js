export const MockMetadataWizard = {
    label: 'Metadata Source',
    type: '@MetadataProvider',
    validatorParams: [],
    bindings: {},
    parser(changes, schema) {
        return changes;
    },
    formatter(changes, schema) {
        return changes;
    },
    display(changes, schema) {
        return changes;
    },
    getValidators() {
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
