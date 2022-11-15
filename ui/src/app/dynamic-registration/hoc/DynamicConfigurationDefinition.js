import API_BASE_PATH from '../../App.constant';

export const DynamicRegistrationDefinition = {
    label: 'Dynamic Registration',
    type: '@DynamicRegistration',
    steps: [
        {
            id: 'common',
            label: 'label.dynamic-registration',
            index: 1,
            fields: [
                'name',
                'redirectUris',
                'responseTypes',
                'grantTypes',
                'applicationType',
                'contacts',
                'subjectType',
                'jwks',
                'jwksUri',
                'tokenEndpointAuthMethod',
                'logoUri',
                'policyUri',
                'tosUri',
                'scope'
            ]
        }
    ],
    schema: `${API_BASE_PATH}/ui/DynamicRegistration`,

    uiSchema: {
        layout: {
            groups: [
                {
                    sizes: {
                        xs: 12,
                        lg: 12
                    },
                    classNames: '',
                    fields: [
                        'name',
                        'redirectUris',
                        'responseTypes',
                        'grantTypes',
                        'applicationType',
                        'contacts',
                        'subjectType',
                        'jwks',
                        'jwksUri',
                        'tokenEndpointAuthMethod',
                        'logoUri',
                        'policyUri',
                        'tosUri',
                        'scope'
                    ]
                }
            ]
        },
        'ui:order': [
            'name',
            'redirectUris',
            '*'
        ]
    },

    parser: (changes) => changes,
    formatter: (changes) => changes,
    display: (changes) => changes,
}

export default DynamicRegistrationDefinition;

