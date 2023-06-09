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
                'grantType',
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
        name: {
            'ui:emptyValue': '',
        },
        redirectUris: {
            'ui:emptyValue': '',
        },
        jwks: {
            'ui:widget': 'textarea'
        },
        layout: {
            groups: [
                {
                    sizes: {
                        xs: 12,
                        lg: 6
                    },
                    classNames: '',
                    fields: [
                        'name',
                        'redirectUris',
                        'responseTypes',
                        'applicationType',
                        'contacts',
                        'logoUri',
                        'policyUri',
                    ]
                },
                {
                    sizes: {
                        xs: 12,
                        lg: 6
                    },
                    classNames: '',
                    fields: [
                        'grantType',
                        'subjectType',
                        'jwks',
                        'jwksUri',
                        'tokenEndpointAuthMethod',
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
    validator: (data = [], current = '') => {

        const names = data.map(s => s.name).filter(n => n !== current);

        return (formData, errors) => {
            if (names.indexOf(formData.name) > -1) {
                errors.name.addError('message.name-unique');
            }
            return errors;
        }
    }
}

export default DynamicRegistrationDefinition;

