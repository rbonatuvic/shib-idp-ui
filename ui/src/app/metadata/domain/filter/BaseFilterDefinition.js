export const BaseFilterDefinition = {
    parser: (changes) => changes,
    formatter: (changes) => changes,
    display: (changes) => changes,
    uiSchema: {
        '@type': {
            'ui:widget': 'hidden'
        },
        'resourceId': {
            'ui:widget': 'hidden'
        }
    }
};
